import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';

// GET /api/bookings — get all bookings for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();

    const bookings = await Booking.find({ user: session.user.id })
      .populate('court', 'name image address price_per_hour')
      .sort({ date: 1 });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings — create a new booking
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in to book a court' }, { status: 401 });
    }

    const { courtId, date, start_time, duration } = await request.json();

    if (!courtId || !date || !start_time || !duration) {
      return NextResponse.json(
        { error: 'Court, date, start time and duration are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check the court exists
    const court = await Court.findById(courtId);
    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    // Check for double booking — same court, same date, same start time
    const existingBooking = await Booking.findOne({ court: courtId, date, start_time });
    if (existingBooking) {
      return NextResponse.json(
        { error: 'This court is already booked at that time. Please choose a different slot.' },
        { status: 409 }
      );
    }

    const total_price = court.price_per_hour * duration;

    const booking = await Booking.create({
      court: courtId,
      user: session.user.id,
      date,
      start_time,
      duration,
      total_price,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
