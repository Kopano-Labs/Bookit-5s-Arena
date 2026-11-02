export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/getSession';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import '@/models/Court';
import { isAllowedBookingStartTime } from '@/lib/bookingSlots';
import { canManageBooking } from '@/lib/bookings/bookingAccess';
import { notifySavedBooking } from '@/lib/bookings/dispatchBookingCommunications';
import { updateReservation, reservationError } from '@/lib/bookings/reservationOwnership';
import { bookingResponse } from '@/lib/bookings/bookingResponse';
import { bookingDateTimeToInstant, isValidBookingDateValue, isPastBookingDate, isElapsedStartTimeForDate } from '@/lib/bookingDates';

// GET /api/bookings/:id — fetch a single booking (owner or admin)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const session = await getAuthSession();

    await connectDB();
    let booking = await Booking.findById(id).select('+guestManagementTokenHash').populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (!(await canManageBooking({ request, session, booking, action: 'read' }))) {
      return NextResponse.json({ error: session ? 'Not authorised' : 'Guest management token required' }, { status: session ? 403 : 401 });
    }

    return NextResponse.json(bookingResponse(booking), { status: 200 });
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

    await connectDB();
    let booking = await Booking.findById(id).select('+guestManagementTokenHash').populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (!(await canManageBooking({ request, session, booking, action: 'reschedule' }))) {
      return NextResponse.json({ error: session ? 'Not authorised' : 'Guest management token required' }, { status: session ? 403 : 401 });
    }

    if (booking.status === 'cancelled') return NextResponse.json({ error: 'Cancelled bookings cannot be rescheduled' }, { status: 409 });

    // Block edit within 8 hours of booking
    const bookingDateTime = bookingDateTimeToInstant(booking.date, booking.start_time);
    const hoursUntil = (bookingDateTime - new Date()) / (1000 * 60 * 60);
    if (!bookingDateTime || hoursUntil < 8) {
      return NextResponse.json({ error: 'Cannot edit a booking within 8 hours of start time' }, { status: 400 });
    }

    const { date, start_time, duration } = await request.json();

    // Validate required fields
    if (!date || !start_time || !duration) {
      return NextResponse.json({ error: 'Date, start time and duration are required' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    if (!isValidBookingDateValue(date) || isPastBookingDate(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (!isAllowedBookingStartTime(start_time, duration)) {
      return NextResponse.json(
        { error: 'Start time must be on the hour and the booking must finish by 22:00' },
        { status: 400 }
      );
    }

    // Validate duration is an integer in allowed range
    if (typeof duration !== 'number' || duration < 1 || duration > 3 || !Number.isInteger(duration)) {
      return NextResponse.json({ error: 'Duration must be 1, 2 or 3 hours' }, { status: 400 });
    }

    const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const OPEN = 10 * 60, CLOSE = 22 * 60;
    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;
    if (isElapsedStartTimeForDate(date, newStart)) return NextResponse.json({ error: 'This start time has passed.' }, { status: 400 });

    if (newStart < OPEN || newEnd > CLOSE) {
      return NextResponse.json({ error: 'Bookings must start at 10:00 and end by 22:00' }, { status: 400 });
    }

    // Overlap check (exclude this booking)
    const sameDayBookings = await Booking.find({
      court: booking.court._id,
      date,
      status: { $ne: 'cancelled' },
      _id: { $ne: id },
    }).select('start_time duration');

    const hasOverlap = sameDayBookings.some((b) => {
      const s = toMinutes(b.start_time);
      const e = s + b.duration * 60;
      return newStart < e && newEnd > s;
    });

    if (hasOverlap) {
      return NextResponse.json({ error: 'This slot is already booked. Choose a different time.' }, { status: 409 });
    }

    ({ booking } = await updateReservation({ booking, changes: {
      date, start_time, duration, total_price: booking.court.price_per_hour * duration,
    } }));
    const receipts = await notifySavedBooking({ booking, court: booking.court,
      customerName: booking.guestName || session?.user?.name,
      customerEmail: booking.guestEmail || session?.user?.email,
      customerPhone: booking.guestPhone });
    return NextResponse.json({ ...bookingResponse(booking), communicationReceipts: receipts }, { status: 200 });
  } catch (error) {
    const handled = reservationError(error);
    if (handled) return NextResponse.json({ error: handled.error }, { status: handled.status });
    console.error('PUT /api/bookings/:id error:', error);
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

    await connectDB();
    let booking = await Booking.findById(id).select('+guestManagementTokenHash').populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (!(await canManageBooking({ request, session, booking, action: 'cancel' }))) {
      return NextResponse.json({ error: session ? 'You are not authorised to cancel this booking' : 'Guest management token required' }, { status: session ? 403 : 401 });
    }

    ({ booking } = await updateReservation({ booking, changes: { status: 'cancelled' }, revokeGuestToken: true }));
    const receipts = await notifySavedBooking({ booking, court: booking.court,
      customerName: booking.guestName || session?.user?.name,
      customerEmail: booking.guestEmail || session?.user?.email,
      customerPhone: booking.guestPhone, purpose: 'reservation_notice' });

    return NextResponse.json({ message: 'Booking cancelled successfully', communicationReceipts: receipts }, { status: 200 });
  } catch (error) {
    const handled = reservationError(error);
    if (handled) return NextResponse.json({ error: handled.error }, { status: handled.status });
    console.error('DELETE /api/bookings/:id error:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
