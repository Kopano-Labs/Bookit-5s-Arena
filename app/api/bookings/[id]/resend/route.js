import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingConfirmation } from '@/lib/sendBookingConfirmation';

export async function POST(request, { params }) {
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

    await sendBookingConfirmation({
      to: session.user.email,
      name: session.user.name,
      courtName: booking.court.name,
      date: booking.date,
      start_time: booking.start_time,
      duration: booking.duration,
      total_price: booking.total_price,
    });

    return NextResponse.json({ message: 'Receipt sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/bookings/:id/resend error:', error);
    return NextResponse.json({ error: 'Failed to resend receipt' }, { status: 500 });
  }
}
