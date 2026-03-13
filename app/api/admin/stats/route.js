import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admins only' }, { status: 403 });
    }

    await connectDB();

    const today = new Date().toISOString().split('T')[0];

    const [totalBookings, revenueResult, courts, upcomingBookings, mostBooked] = await Promise.all([
      // Total non-cancelled bookings
      Booking.countDocuments({ status: { $ne: 'cancelled' } }),

      // Sum of all revenue
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total_price' } } },
      ]),

      // Total courts
      Court.countDocuments(),

      // Upcoming bookings from today
      Booking.countDocuments({ date: { $gte: today }, status: { $ne: 'cancelled' } }),

      // Most booked court
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: '$court', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        { $lookup: { from: 'courts', localField: '_id', foreignField: '_id', as: 'court' } },
        { $unwind: '$court' },
        { $project: { name: '$court.name', count: 1 } },
      ]),
    ]);

    return NextResponse.json({
      totalBookings,
      totalRevenue: revenueResult[0]?.total ?? 0,
      totalCourts: courts,
      upcomingBookings,
      mostBookedCourt: mostBooked[0] ?? null,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
