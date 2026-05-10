export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';
import Booking from '@/models/Booking';
import {
  BOOKING_CLOSE_HOUR,
  BOOKING_MAX_DURATION,
  BOOKING_OPEN_HOUR,
  isAllowedBookingStartTime,
  toHourStart,
} from '@/lib/bookingSlots';

/** @param {string} t */
function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Same overlap rule as POST /api/bookings: intervals [start, end) in minutes.
 * @param {{ start_time: string, duration: number }[]} bookings
 * @param {string} startTime
 * @param {number} durationHours
 */
function slotConflicts(bookings, startTime, durationHours) {
  const newStart = toMinutes(startTime);
  const newEnd = newStart + durationHours * 60;
  return bookings.some((b) => {
    const existStart = toMinutes(b.start_time);
    const existEnd = existStart + b.duration * 60;
    return newStart < existEnd && newEnd > existStart;
  });
}

/**
 * GET /api/availability?date=YYYY-MM-DD&courtId=<optional ObjectId>
 * Public read: lists bookable hour slots per court (non-cancelled bookings only).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const courtId = searchParams.get('courtId');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(date).getTime())) {
      return NextResponse.json({ error: 'Query parameter date (YYYY-MM-DD) is required' }, { status: 400 });
    }

    if (courtId && !/^[a-fA-F0-9]{24}$/.test(courtId)) {
      return NextResponse.json({ error: 'Invalid courtId' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    if (bookingDate < today) {
      return NextResponse.json({ error: 'date must be today or in the future' }, { status: 400 });
    }

    await connectDB();

    const courtFilter = courtId ? { _id: courtId } : {};
    const courts = await Court.find(courtFilter).sort({ sortOrder: 1, createdAt: 1 }).select('_id name').lean();

    if (courtId && courts.length === 0) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    const courtIds = courts.map((c) => c._id);

    const bookingRows = await Booking.find({
      court: { $in: courtIds },
      date,
      status: { $ne: 'cancelled' },
    })
      .select('court start_time duration')
      .lean();

    /** @type {Map<string, { start_time: string, duration: number }[]>} */
    const byCourt = new Map();
    for (const row of bookingRows) {
      const key = String(row.court);
      if (!byCourt.has(key)) byCourt.set(key, []);
      byCourt.get(key).push({ start_time: row.start_time, duration: row.duration });
    }

    const payload = {
      date,
      window: { open: `${String(BOOKING_OPEN_HOUR).padStart(2, '0')}:00`, close: `${String(BOOKING_CLOSE_HOUR).padStart(2, '0')}:00` },
      courts: courts.map((court) => {
        const bookings = byCourt.get(String(court._id)) || [];
        const slots = [];

        for (let hour = BOOKING_OPEN_HOUR; hour < BOOKING_CLOSE_HOUR; hour += 1) {
          const start_time = toHourStart(hour);
          if (!isAllowedBookingStartTime(start_time, 1)) continue;

          const availableDurations = [];
          for (let d = 1; d <= BOOKING_MAX_DURATION; d += 1) {
            if (!isAllowedBookingStartTime(start_time, d)) continue;
            if (!slotConflicts(bookings, start_time, d)) availableDurations.push(d);
          }

          if (availableDurations.length) {
            slots.push({ start_time, availableDurations });
          }
        }

        return {
          id: String(court._id),
          name: court.name,
          slots,
        };
      }),
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('GET /api/availability error:', error);
    return NextResponse.json({ error: 'Failed to load availability' }, { status: 500 });
  }
}
