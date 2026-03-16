import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';

// GET /api/courts — fetch all courts (public)
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

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can add courts' }, { status: 403 });
      }
      
      filter = { owner: session.user.id };
    }


    await connectDB();

    // .lean() returns plain JS objects instead of Mongoose Documents — ~3× faster for read-only routes
    const courts = await Court.find(filter)
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    const res = NextResponse.json(courts, { status: 200 });

    // Public court list changes rarely — cache 60 s at edge, serve stale while revalidating
    if (!mine) {
      res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    }

    return res;
  } catch (error) {
    console.error('GET /api/courts error:', error);
    return NextResponse.json({ error: 'Failed to fetch courts' }, { status: 500 });
  }
}

