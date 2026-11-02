export const dynamic = 'force-dynamic';
import { getAuthSession } from '@/lib/getSession';
import { requireRole } from '@/lib/roles';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { updateReservation, reservationError } from '@/lib/bookings/reservationOwnership';
import { bookingResponse } from '@/lib/bookings/bookingResponse';
import '@/models/Court';
import { bookingScopeForAdmin } from '@/lib/bookings/arenaAccess';
import { dispatchBookingCommunications } from '@/lib/bookings/dispatchBookingCommunications';

export async function PATCH(request, { params }) {
  try {
  const session = await getAuthSession();
  if (!requireRole(session, 'admin')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { paymentStatus } = await request.json();

  // Validate paymentStatus against allowed enum values
  const allowedStatuses = ['unpaid', 'paid', 'refunded', 'reserved'];
  if (!paymentStatus || !allowedStatuses.includes(paymentStatus)) {
    return Response.json({ error: 'Invalid payment status' }, { status: 400 });
  }

  const { id } = await params;

  // Validate ObjectId format
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return Response.json({ error: 'Invalid booking ID' }, { status: 400 });
  }

  const scope = await bookingScopeForAdmin(session);
  let booking = await Booking.findOne({ _id: id, ...scope }).populate('court');
  if (!booking) return Response.json({ error: 'Not found' }, { status: 404 });
  const result = await updateReservation({ booking, changes: { paymentStatus } });
  booking = result.booking;
  const changed = result.changed;
  const communicationReceipts = changed ? await dispatchBookingCommunications({
    booking, court: booking.court, customerName: booking.guestName || 'Bookit player',
    customerEmail: booking.guestEmail, customerPhone: booking.guestPhone, purpose: 'payment_receipt',
  }) : [];
  return Response.json({ success: true, booking: bookingResponse(booking), communicationReceipts });
  } catch (error) {
    const handled = reservationError(error);
    if (handled) return Response.json({ error: handled.error }, { status: handled.status });
    return Response.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
}
