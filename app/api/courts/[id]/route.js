import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';

// GET /api/courts/:id — fetch a single court (public)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const court = await Court.findById(params.id);

    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    return NextResponse.json(court, { status: 200 });
  } catch (error) {
    console.error('GET /api/courts/:id error:', error);
    return NextResponse.json({ error: 'Failed to fetch court' }, { status: 500 });
  }
}

// PUT /api/courts/:id — update a court (owner only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const court = await Court.findById(params.id);

    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    if (court.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorised to edit this court' }, { status: 403 });
    }

    const body = await request.json();
    const updatedCourt = await Court.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedCourt, { status: 200 });
  } catch (error) {
    console.error('PUT /api/courts/:id error:', error);
    return NextResponse.json({ error: 'Failed to update court' }, { status: 500 });
  }
}

// DELETE /api/courts/:id — delete a court (owner only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    await connectDB();
    const court = await Court.findById(params.id);

    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    if (court.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorised to delete this court' }, { status: 403 });
    }

    await court.deleteOne();

    return NextResponse.json({ message: 'Court deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/courts/:id error:', error);
    return NextResponse.json({ error: 'Failed to delete court' }, { status: 500 });
  }
}
