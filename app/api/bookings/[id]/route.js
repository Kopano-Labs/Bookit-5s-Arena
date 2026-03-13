import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import '@/models/Court';
import { sendBookingConfirmation } from '@/lib/sendBookingConfirmation';

// GET /api/bookings/:id — fetch a single booking (owner or admin)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(id).populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.user.toString() !== session.user.id && session.user.role !== 'admin') {
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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(id).populate('court');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
    }

    // Block edit within 8 hours of booking
    const [h, m] = booking.start_time.split(':').map(Number);
    const bookingDateTime = new Date(`${booking.date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`);
    const hoursUntil = (bookingDateTime - new Date()) / (1000 * 60 * 60);
    if (hoursUntil < 8) {
      return NextResponse.json({ error: 'Cannot edit a booking within 8 hours of start time' }, { status: 400 });
    }

    const { date, start_time, duration } = await request.json();

    const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const OPEN = 10 * 60, CLOSE = 22 * 60;
    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;

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

    booking.date = date;
    booking.start_time = start_time;
    booking.duration = duration;
    booking.total_price = booking.court.price_per_hour * duration;
        await booking.save();

          try {
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
          } catch (emailError) {
            console.error('Failed to send update email:', emailError);
          }

          return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('PUT /api/bookings/:id error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/bookings/:id — cancel a booking (owner only)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorised to cancel this booking' }, { status: 403 });
    }

    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/bookings/:id error:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
