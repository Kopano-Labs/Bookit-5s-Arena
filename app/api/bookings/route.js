export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/getSession';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';
import { rateLimit } from '@/lib/rateLimit';
import { verifyBotRequest } from '@/lib/security/botid';
import { isAllowedBookingStartTime } from '@/lib/bookingSlots';
import { bookingResponse } from '@/lib/bookings/bookingResponse';
import { isValidBookingDateValue, isPastBookingDate, isElapsedStartTimeForDate } from '@/lib/bookingDates';
import { notifySavedBooking } from '@/lib/bookings/dispatchBookingCommunications';
import { createReservationWithClaims, readIdempotencyKey, reservationReplayIdentity, findReservationReplay, reservationError } from '@/lib/bookings/reservationOwnership';

// GET /api/bookings — get all bookings for the logged-in user
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();

    // .lean() returns plain JS objects (no Mongoose overhead) — faster for read-only list views
    const bookings = await Booking.find({ user: session.user.id })
      .populate('court', 'name image address price_per_hour')
      .sort({ date: 1 })
      .lean();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings — create a new booking
export async function POST(request) {
  try {
    const botVerification = await verifyBotRequest();
    if (botVerification.isBot) {
      return NextResponse.json({ error: 'Automated booking attempts are blocked.' }, { status: 403 });
    }

    // Rate limit: max 10 booking attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (rateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be logged in to book a court' }, { status: 401 });
    }

    const { courtId, date, start_time, duration, payAtVenue } = await request.json();

    if (!courtId || !date || !start_time || !duration) {
      return NextResponse.json(
        { error: 'Court, date, start time and duration are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(courtId)) {
      return NextResponse.json({ error: 'Invalid court ID' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    if (!isValidBookingDateValue(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (isPastBookingDate(date)) {
      return NextResponse.json({ error: 'Bookings cannot be in the past.' }, { status: 400 });
    }

    // Validate duration is a number in allowed range
    if (typeof duration !== 'number' || duration < 1 || duration > 3 || !Number.isInteger(duration)) {
      return NextResponse.json({ error: 'Duration must be 1, 2 or 3 hours' }, { status: 400 });
    }

    await connectDB();

    // Check the court exists
    const court = await Court.findById(courtId);
    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }
    const { idempotencyKey, idempotencyFingerprint } = reservationReplayIdentity(
      readIdempotencyKey(request), 'user:' + session.user.id, [courtId, date, start_time, duration, Boolean(payAtVenue)]);
    const existing = await findReservationReplay(idempotencyKey, idempotencyFingerprint);
    if (existing) return NextResponse.json(bookingResponse(existing, { replay: true }), { status: 200 });

    // Validate time window
    const toMinutes = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const OPEN_MINUTES = 10 * 60;   // 10:00
    const CLOSE_MINUTES = 22 * 60;  // 22:00

    if (!isAllowedBookingStartTime(start_time, duration)) {
      return NextResponse.json(
        { error: 'Start time must be on the hour and the booking must finish by 22:00.' },
        { status: 400 }
      );
    }

    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;
    if (isElapsedStartTimeForDate(date, newStart)) return NextResponse.json({ error: 'This start time has passed.' }, { status: 400 });

    if (newStart < OPEN_MINUTES || newEnd > CLOSE_MINUTES) {
      return NextResponse.json(
        { error: 'Bookings must start at 10:00 and end by 22:00.' },
        { status: 400 }
      );
    }

    const total_price = court.price_per_hour * duration;

    const { booking, replayed } = await createReservationWithClaims({
      court, date, start_time, duration, idempotencyKey, idempotencyFingerprint,
      bookingFields: { user: session.user.id, total_price, status: 'pending', paymentStatus: payAtVenue ? 'reserved' : 'unpaid' },
    });

    if (replayed) return NextResponse.json(bookingResponse(booking, { replay: true }), { status: 200 });

    const communicationReceipts = await notifySavedBooking({ booking, court,
      customerName: session.user.name, customerEmail: session.user.email,
      customerPhone: session.user.phone });
    return NextResponse.json({ ...bookingResponse(booking), communicationReceipts }, { status: 201 });
  } catch (error) {
    const handled = reservationError(error);
    if (handled) return NextResponse.json({ error: handled.error }, { status: handled.status });
    console.error('POST /api/bookings error:', error);
    if (error?.code === 'BOOKING_SLOT_TAKEN') {
      return NextResponse.json({ error: 'This court is already booked during that time. Please choose a different slot.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
