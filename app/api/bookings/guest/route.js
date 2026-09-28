export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';
import { rateLimit } from '@/lib/rateLimit';
import { verifyBotRequest } from '@/lib/security/botid';
import { isAllowedBookingStartTime } from '@/lib/bookingSlots';
import { isElapsedStartTimeForDate, isPastBookingDate, isValidBookingDateValue } from '@/lib/bookingDates';
import {
  attachBookingSlotClaim,
  BookingSlotConflictError,
  claimBookingSlots,
  releaseBookingSlotClaim,
} from '@/lib/bookingSlotClaims';

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// POST /api/bookings/guest — reserve without login (pay at venue)
export async function POST(request) {
  let slotClaimId = null;
  let bookingCreated = false;
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

    if (!isValidBookingDateValue(date)) {
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    if (isPastBookingDate(date)) {
      return NextResponse.json({ error: 'Bookings cannot be in the past.' }, { status: 400 });
    }

    // Validate duration is an integer in allowed range
    if (typeof duration !== 'number' || duration < 1 || duration > 3 || !Number.isInteger(duration)) {
      return NextResponse.json({ error: 'Duration must be 1, 2 or 3 hours.' }, { status: 400 });
    }

    if (!isAllowedBookingStartTime(start_time, duration)) {
      return NextResponse.json(
        { error: 'Start time must be on the hour and the booking must finish by 22:00.' },
        { status: 400 }
      );
    }
    if (isElapsedStartTimeForDate(date, toMinutes(start_time))) {
      return NextResponse.json(
        { error: 'That start time has already passed in South Africa. Choose a later slot.' },
        { status: 400 },
      );
    }

    // Validate guest name length
    if (typeof guestName !== 'string' || guestName.trim().length < 2 || guestName.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    // Basic email validation
    const normalizedEmail = typeof guestEmail === 'string' ? guestEmail.trim() : '';
    if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    // Basic phone validation (South African: 10 digits or +27...)
    if (typeof guestPhone !== 'string' || !/^(\+27|0)[0-9]{9}$/.test(guestPhone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Please enter a valid South African phone number.' }, { status: 400 });
    }

    await connectDB();

    const court = await Court.findById(courtId);
    if (!court) return NextResponse.json({ error: 'Court not found.' }, { status: 404 });

    // Time validation
    const OPEN = 10 * 60;
    const CLOSE = 22 * 60;
    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;
    if (newStart < OPEN || newEnd > CLOSE) {
      return NextResponse.json({ error: 'Bookings must start at 10:00 and end by 22:00.' }, { status: 400 });
    }

    const total_price = court.price_per_hour * duration;
    slotClaimId = await claimBookingSlots({ courtId, date, startTime: start_time, duration });

    // Build booking — omit `user` so Mongoose uses schema default (null)
    const booking = await Booking.create({
      court: courtId,
      guestName: guestName.trim(),
      guestEmail: normalizedEmail.toLowerCase(),
      guestPhone: guestPhone.trim(),
      date,
      start_time,
      duration,
      total_price,
      status: 'pending',
      paymentStatus: 'reserved',
      slotClaimId,
    });
    bookingCreated = true;
    try {
      await attachBookingSlotClaim(slotClaimId, booking._id);
    } catch (claimError) {
      console.error('Guest booking saved but slot claim could not be attached:', claimError);
    }

    return NextResponse.json({
      _id: String(booking._id),
      courtId: String(court._id),
      courtName: court.name,
      date: booking.date,
      start_time: booking.start_time,
      duration: booking.duration,
      total_price: booking.total_price,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings/guest error:', error);
    if (slotClaimId && !bookingCreated) await releaseBookingSlotClaim(slotClaimId).catch(() => {});

    if (error instanceof BookingSlotConflictError || error?.code === 'BOOKING_SLOT_CONFLICT' || error?.code === 11000) {
      return NextResponse.json(
        { error: 'This court was just booked for that start time. Refresh availability and choose another slot.' },
        { status: 409 }
      );
    }

    // Provide a cleaner user-facing message
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Reservation could not be processed. Please try again or contact us via WhatsApp.` },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Something went wrong. Please try again or contact us via WhatsApp.' }, { status: 500 });
  }
}
