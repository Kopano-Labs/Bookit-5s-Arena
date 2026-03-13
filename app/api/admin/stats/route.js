import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admins only' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const statusFilter = searchParams.get('status');

    const today = new Date().toISOString().split('T')[0];

    const match = { status: { $ne: 'cancelled' } };
    if (from) match.date = { ...match.date, $gte: from };
    if (to) match.date = { ...match.date, $lte: to };
    if (statusFilter === 'upcoming') match.date = { ...match.date, $gte: today };
    if (statusFilter === 'past') match.date = { ...match.date, $lt: today };

    const [totalBookings, revenueResult, courts, upcomingBookings, mostBooked, courtBreakdown] = await Promise.all([
      Booking.countDocuments(match),
      Booking.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: '$total_price' } } },
      ]),
      Court.countDocuments(),
      Booking.countDocuments({ date: { $gte: today }, status: { $ne: 'cancelled' } }),
      Booking.aggregate([
        { $match: match },
        { $group: { _id: '$court', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        { $lookup: { from: 'courts', localField: '_id', foreignField: '_id', as: 'court' } },
        { $unwind: '$court' },
        { $project: { name: '$court.name', count: 1 } },
      ]),
      Booking.aggregate([
        { $match: match },
        { $group: { _id: '$court', bookings: { $sum: 1 }, revenue: { $sum: '$total_price' } } },
        { $sort: { bookings: -1 } },
        { $lookup: { from: 'courts', localField: '_id', foreignField: '_id', as: 'court' } },
        { $unwind: '$court' },
        { $project: { name: '$court.name', bookings: 1, revenue: 1 } },
      ]),
    ]);

    return NextResponse.json({
      totalBookings,
      totalRevenue: revenueResult[0]?.total ?? 0,
      totalCourts: courts,
      upcomingBookings,
      mostBookedCourt: mostBooked[0] ?? null,
      courtBreakdown,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
