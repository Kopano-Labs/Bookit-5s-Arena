export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/getSession';
import { requireRole } from '@/lib/roles';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import '@/models/Court';
import '@/models/User';
import { isValidBookingDateValue } from '@/lib/bookingDates';

export async function GET(request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    if (!requireRole(session, 'admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const status = searchParams.get('status');
    const court = searchParams.get('court');

    if ((from && !isValidBookingDateValue(from)) || (to && !isValidBookingDateValue(to))) {
      return NextResponse.json({ error: 'Date filters must use YYYY-MM-DD.' }, { status: 400 });
    }
    if (from && to && from > to) {
      return NextResponse.json({ error: 'The start date must be on or before the end date.' }, { status: 400 });
    }
    const match = {};
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = from;
      if (to) match.date.$lte = to;
    }
    // Validate status against allowed enum to prevent NoSQL injection
    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid booking status filter.' }, { status: 400 });
    }
    if (status) match.status = status;
    // Validate court ObjectId format
    if (court && !/^[a-fA-F0-9]{24}$/.test(court)) {
      return NextResponse.json({ error: 'Invalid court filter.' }, { status: 400 });
    }
    if (court) match.court = court;

    const bookings = await Booking.find(match)
      .populate('court', 'name price_per_hour')
      .populate('user', 'name email')
      .sort({ date: -1, start_time: -1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Admin bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
