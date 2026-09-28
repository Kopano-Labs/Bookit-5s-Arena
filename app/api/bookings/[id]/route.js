export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/getSession';
import { requireRole } from '@/lib/roles';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import '@/models/Court';
import { sendBookingConfirmation } from '@/lib/sendBookingConfirmation';
import { sendResendConfirmation, isResendBookingConfirmationConfigured } from '@/lib/messaging/bookingResendConfirmation';
import { isAllowedBookingStartTime } from '@/lib/bookingSlots';
import { bookingDateTimeToInstant, isElapsedStartTimeForDate, isPastBookingDate, isValidBookingDateValue } from '@/lib/bookingDates';
import { attachBookingSlotClaim, claimBookingSlots, releaseBookingSlotClaim } from '@/lib/bookingSlotClaims';

// GET /api/bookings/:id — fetch a single booking (owner or admin)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(id).select('+slotClaimId').populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isOwner = booking.user && booking.user.toString() === session.user.id;
    if (!isOwner && !requireRole(session, 'admin')) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('GET /api/bookings/:id error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT /api/bookings/:id — edit a booking (owner only, not within 8hrs)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(id).select('+slotClaimId').populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (!booking.user || booking.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Cancelled bookings cannot be changed. Create a new reservation instead.' }, { status: 409 });
    }

    // Block edit within 8 hours of booking
    const bookingDateTime = bookingDateTimeToInstant(booking.date, booking.start_time);
    const hoursUntil = bookingDateTime ? (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60) : -1;
    if (hoursUntil < 8) {
      return NextResponse.json({ error: 'Cannot edit a booking within 8 hours of start time' }, { status: 400 });
    }

    const { date, start_time, duration } = await request.json();

    // Validate required fields
    if (!date || !start_time || duration === undefined) {
      return NextResponse.json({ error: 'Date, start time and duration are required' }, { status: 400 });
    }

    if (!isValidBookingDateValue(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (isPastBookingDate(date)) {
      return NextResponse.json({ error: 'Bookings cannot be in the past.' }, { status: 400 });
    }

    if (typeof duration !== 'number' || duration < 1 || duration > 3 || !Number.isInteger(duration)) {
      return NextResponse.json({ error: 'Duration must be 1, 2 or 3 hours' }, { status: 400 });
    }

    if (!isAllowedBookingStartTime(start_time, duration)) {
      return NextResponse.json(
        { error: 'Start time must be on the hour and the booking must finish by 22:00' },
        { status: 400 }
      );
    }

    const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    if (isElapsedStartTimeForDate(date, toMinutes(start_time))) {
      return NextResponse.json({ error: 'That start time has already passed in South Africa. Choose a later slot.' }, { status: 400 });
    }
    const OPEN = 10 * 60, CLOSE = 22 * 60;
    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;

    if (newStart < OPEN || newEnd > CLOSE) {
      return NextResponse.json({ error: 'Bookings must start at 10:00 and end by 22:00' }, { status: 400 });
    }

    const oldClaimId = booking.slotClaimId;
    const oldBooking = {
      date: booking.date,
      start_time: booking.start_time,
      duration: booking.duration,
    };
    await releaseBookingSlotClaim(oldClaimId);

    const restoreOldClaim = async () => {
      const restored = await claimBookingSlots({
        courtId: booking.court._id,
        date: oldBooking.date,
        startTime: oldBooking.start_time,
        duration: oldBooking.duration,
        excludeBookingId: id,
      });
      booking.slotClaimId = restored;
      await booking.save();
      await attachBookingSlotClaim(restored, booking._id);
    };

    let nextClaimId;
    try {
      nextClaimId = await claimBookingSlots({
        courtId: booking.court._id,
        date,
        startTime: start_time,
        duration,
        excludeBookingId: id,
      });
    } catch (error) {
      try {
        await restoreOldClaim();
      } catch (restoreError) {
        console.error('Could not restore the original booking slot claim:', restoreError);
      }
      throw error;
    }

    booking.date = date;
    booking.start_time = start_time;
    booking.duration = duration;
    booking.total_price = booking.court.price_per_hour * duration;
    booking.slotClaimId = nextClaimId;
    try {
      await booking.save();
    } catch (error) {
      await releaseBookingSlotClaim(nextClaimId).catch(() => {});
      try {
        booking.date = oldBooking.date;
        booking.start_time = oldBooking.start_time;
        booking.duration = oldBooking.duration;
        booking.total_price = booking.court.price_per_hour * oldBooking.duration;
        await restoreOldClaim();
      } catch (restoreError) {
        console.error('Could not restore the original booking after a failed update:', restoreError);
      }
      throw error;
    }
    try {
      await attachBookingSlotClaim(nextClaimId, booking._id);
    } catch (claimError) {
      console.error('Booking updated but slot claim could not be attached:', claimError);
    }

          try {
            let emailSent = false;
            if (isResendBookingConfirmationConfigured()) {
              const resendResponse = await sendResendConfirmation({
                id: booking._id.toString(),
                date: booking.date,
                time: booking.start_time,
                court: booking.court.name,
                amount: booking.total_price,
                type: 'update'
              }, session.user.email);
              
              if (resendResponse.success) {
                emailSent = true;
              } else {
                console.warn('Resend update email failed, falling back to Nodemailer:', resendResponse.error);
              }
            }
      
            if (!emailSent) {
              await sendBookingConfirmation({
                to: session.user.email,
                name: session.user.name,
                courtName: booking.court.name,
                date: booking.date,
                start_time: booking.start_time,
                duration: booking.duration,
                total_price: booking.total_price,
                type: 'update',
              });
            }
          } catch (emailError) {
            console.error('Failed to send update email:', emailError);
          }

          return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('PUT /api/bookings/:id error:', error);
    if (error?.code === 'BOOKING_SLOT_CONFLICT' || error?.code === 11000) {
      return NextResponse.json({ error: 'That court and time was just taken. Refresh availability and choose another slot.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/bookings/:id — cancel a booking (owner or admin)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(id).select('+slotClaimId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Allow booking owner or admin to cancel
    const isOwner = booking.user && booking.user.toString() === session.user.id;
    const isAdmin = requireRole(session, 'admin');
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'You are not authorised to cancel this booking' }, { status: 403 });
    }

    const wasActive = booking.status !== 'cancelled';
    if (wasActive) await releaseBookingSlotClaim(booking.slotClaimId);

    const previousStatus = booking.status;
    const previousClaimId = booking.slotClaimId;
    booking.status = 'cancelled';
    booking.slotClaimId = null;
    try {
      await booking.save();
    } catch (error) {
      if (wasActive) {
        try {
          const restored = await claimBookingSlots({
            courtId: booking.court,
            date: booking.date,
            startTime: booking.start_time,
            duration: booking.duration,
            excludeBookingId: id,
          });
          booking.status = previousStatus;
          booking.slotClaimId = restored || previousClaimId;
          await booking.save();
          await attachBookingSlotClaim(booking.slotClaimId, booking._id);
        } catch (restoreError) {
          console.error('Could not restore the booking after a failed cancellation:', restoreError);
        }
      }
      throw error;
    }

    return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/bookings/:id error:', error);
    if (error?.code === 'BOOKING_SLOT_CONFLICT' || error?.code === 11000) {
      return NextResponse.json({ error: 'The booking changed while it was being cancelled. Refresh before trying again.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
