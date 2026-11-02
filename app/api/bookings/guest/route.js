export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';
import { rateLimit } from '@/lib/rateLimit';
import { verifyBotRequest } from '@/lib/security/botid';
import { isAllowedBookingStartTime } from '@/lib/bookingSlots';
import { bookingResponse } from '@/lib/bookings/bookingResponse';
import { isValidBookingDateValue, isPastBookingDate, isElapsedStartTimeForDate } from '@/lib/bookingDates';
import { notifySavedBooking } from '@/lib/bookings/dispatchBookingCommunications';
import { createGuestManagementToken, createReservationWithClaims, readIdempotencyKey, reservationReplayIdentity, findReservationReplay, reservationError } from '@/lib/bookings/reservationOwnership';

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// POST /api/bookings/guest — reserve without login (pay at venue)
export async function POST(request) {
  try {
    const botVerification = await verifyBotRequest();
    if (botVerification.isBot) {
      return NextResponse.json({ error: 'Automated guest reservations are blocked.' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (rateLimit(ip, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { courtId, date, start_time, duration, guestName, guestEmail, guestPhone } = await request.json();

    if (!courtId || !date || !start_time || !duration) {
      return NextResponse.json({ error: 'Court, date, start time and duration are required.' }, { status: 400 });
    }
    if (!guestName || !guestEmail || !guestPhone) {
      return NextResponse.json({ error: 'Name, email and phone number are required for guest reservations.' }, { status: 400 });
    }

    // Validate ObjectId format to prevent NoSQL injection
    if (!/^[a-fA-F0-9]{24}$/.test(courtId)) {
      return NextResponse.json({ error: 'Invalid court ID.' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    if (!isValidBookingDateValue(date)) {
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    if (isPastBookingDate(date)) {
      return NextResponse.json({ error: 'Bookings cannot be in the past.' }, { status: 400 });
    }

    if (!isAllowedBookingStartTime(start_time, duration)) {
      return NextResponse.json(
        { error: 'Start time must be on the hour and the booking must finish by 22:00.' },
        { status: 400 }
      );
    }

    // Validate duration is an integer in allowed range
    if (typeof duration !== 'number' || duration < 1 || duration > 3 || !Number.isInteger(duration)) {
      return NextResponse.json({ error: 'Duration must be 1, 2 or 3 hours.' }, { status: 400 });
    }

    // Validate guest name length
    if (typeof guestName !== 'string' || guestName.trim().length < 2 || guestName.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    // Basic email validation
    if (typeof guestEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    // Basic phone validation (South African: 10 digits or +27...)
    if (typeof guestPhone !== 'string' || !/^(\+27|0)[0-9]{9}$/.test(guestPhone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Please enter a valid South African phone number.' }, { status: 400 });
    }

    await connectDB();

    const court = await Court.findById(courtId);
    if (!court) return NextResponse.json({ error: 'Court not found.' }, { status: 404 });
    const { idempotencyKey, idempotencyFingerprint } = reservationReplayIdentity(
      readIdempotencyKey(request), 'guest:' + guestEmail.trim().toLowerCase(), [courtId, date, start_time, duration, guestName.trim(), guestEmail.trim().toLowerCase(), guestPhone.replace(/\s/g, '')]);
    const existing = await findReservationReplay(idempotencyKey, idempotencyFingerprint);
    if (existing) return NextResponse.json(bookingResponse(existing, { replay: true }), { status: 200 });

    // Time validation
    const OPEN = 10 * 60;
    const CLOSE = 22 * 60;
    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;
    if (isElapsedStartTimeForDate(date, newStart)) return NextResponse.json({ error: 'This start time has passed.' }, { status: 400 });
    if (newStart < OPEN || newEnd > CLOSE) {
      return NextResponse.json({ error: 'Bookings must start at 10:00 and end by 22:00.' }, { status: 400 });
    }

    const total_price = court.price_per_hour * duration;

    // Build booking — omit `user` so Mongoose uses schema default (null)
    const management = createGuestManagementToken();
    const { booking, replayed } = await createReservationWithClaims({
      court, date, start_time, duration, idempotencyKey, idempotencyFingerprint,
      bookingFields: {
        guestName: guestName.trim(), guestEmail: guestEmail.trim().toLowerCase(), guestPhone: guestPhone.trim(),
        total_price, status: 'pending', paymentStatus: 'reserved',
        guestManagementTokenHash: management.hash,
        guestManagementTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    if (replayed) {
      return NextResponse.json(bookingResponse(booking, { replay: true }), { status: 200 });
    }

    const communicationReceipts = await notifySavedBooking({ booking, court,
      customerName: booking.guestName, customerEmail: booking.guestEmail,
      customerPhone: booking.guestPhone });
    // The opaque token is returned once to the originating customer flow and
    // only its SHA-256 verifier is retained in MongoDB.
    return NextResponse.json({ ...bookingResponse(booking), guestManagementToken: management.token, communicationReceipts }, { status: 201 });
  } catch (error) {
    const handled = reservationError(error);
    if (handled) return NextResponse.json({ error: handled.error }, { status: handled.status });
    console.error('POST /api/bookings/guest error:', error);

    // Provide a cleaner user-facing message
    if (error?.code === 'BOOKING_SLOT_TAKEN') {
      return NextResponse.json({ error: 'This court is already booked during that time. Please choose a different slot.' }, { status: 409 });
    }
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Reservation could not be processed. Please try again or contact us via WhatsApp.` },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Something went wrong. Please try again or contact us via WhatsApp.' }, { status: 500 });
  }
}
