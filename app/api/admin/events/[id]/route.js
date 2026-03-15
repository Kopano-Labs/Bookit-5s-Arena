import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import EventBooking from '@/models/EventBooking';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();

    const { id } = await params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid event booking ID' }, { status: 400 });
    }

    const { status } = await request.json();

    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const eventBooking = await EventBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!eventBooking) return NextResponse.json({ error: 'Event booking not found' }, { status: 404 });
    return NextResponse.json(eventBooking);
  } catch (error) {
    console.error('Update event booking error:', error);
    return NextResponse.json({ error: 'Failed to update event booking' }, { status: 500 });
  }
}
