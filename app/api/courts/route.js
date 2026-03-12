import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';

// GET /api/courts — fetch all courts (public)
export async function GET() {
  try {
    await connectDB();
    const courts = await Court.find({}).sort({ sortOrder: 1, createdAt: 1 });
    return NextResponse.json(courts, { status: 200 });
  } catch (error) {
    console.error('GET /api/courts error:', error);
    return NextResponse.json({ error: 'Failed to fetch courts' }, { status: 500 });
  }
}

// POST /api/courts — create a new court (logged-in users only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'You must be logged in to add a court' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, address, location, capacity, amenities, availability, price_per_hour, image } = body;

    if (!name || !description || !address || !price_per_hour) {
      return NextResponse.json(
        { error: 'Name, description, address and price are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const court = await Court.create({
      owner: session.user.id,
      name,
      description,
      address,
      location,
      capacity: capacity || 10,
      amenities,
      availability,
      price_per_hour,
      image: image || 'court-default.jpg',
    });

    return NextResponse.json(court, { status: 201 });
  } catch (error) {
    console.error('POST /api/courts error:', error);
    return NextResponse.json({ error: 'Failed to create court' }, { status: 500 });
  }
}
