import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';

// GET /api/courts — fetch courts (public). Add ?mine=true to get only the logged-in user's courts.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine') === 'true';

    let filter = {};

    if (mine) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
      }
      filter = { owner: session.user.id };
    }

    await connectDB();
    const courts = await Court.find(filter).sort({ sortOrder: 1, createdAt: 1 });
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
