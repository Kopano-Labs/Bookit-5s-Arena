export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { attachBookingSlotClaim, claimBookingSlots, releaseBookingSlotClaim } from '@/lib/bookingSlotClaims';
import dbConnect from '@/lib/mongodb';
import { getAuthSession } from '@/lib/getSession';
import { requireRole } from '@/lib/roles';
import Booking from '@/models/Booking';

export async function PATCH(request, { params }) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    if (!requireRole(session, 'admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();

    const { id } = await params;
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const { status } = await request.json();
    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!allowed.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const booking = await Booking.findById(id).select('+slotClaimId');
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const previousStatus = booking.status;
    const previousClaimId = booking.slotClaimId;

    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      await releaseBookingSlotClaim(previousClaimId);
      booking.status = 'cancelled';
      booking.slotClaimId = null;
      try {
        await booking.save();
      } catch (error) {
        try {
          const restoredClaimId = await claimBookingSlots({
            courtId: booking.court,
            date: booking.date,
            startTime: booking.start_time,
            duration: booking.duration,
            excludeBookingId: id,
          });
          booking.status = previousStatus;
          booking.slotClaimId = restoredClaimId;
          await booking.save();
          await attachBookingSlotClaim(restoredClaimId, booking._id);
        } catch (restoreError) {
          console.error('Could not restore the booking after a failed admin cancellation:', restoreError);
        }
        throw error;
      }
    } else if (status !== 'cancelled' && (previousStatus === 'cancelled' || !previousClaimId)) {
      const claimId = await claimBookingSlots({
        courtId: booking.court,
        date: booking.date,
        startTime: booking.start_time,
        duration: booking.duration,
        excludeBookingId: id,
      });
      booking.status = status;
      booking.slotClaimId = claimId;
      try {
        await booking.save();
        await attachBookingSlotClaim(claimId, booking._id);
      } catch (error) {
        await releaseBookingSlotClaim(claimId).catch(() => {});
        throw error;
      }
    } else if (status !== previousStatus) {
      booking.status = status;
      await booking.save();
    }

    return NextResponse.json({
      _id: String(booking._id),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    if (error?.code === 'BOOKING_SLOT_CONFLICT' || error?.code === 11000) {
      return NextResponse.json(
        { error: 'That court and time now conflicts with another reservation. Refresh the booking list before changing status.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
