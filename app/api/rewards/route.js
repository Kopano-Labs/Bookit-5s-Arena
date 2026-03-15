import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

// Tier thresholds based on total confirmed bookings
const getTier = (count) => {
  if (count >= 20) return { name: 'Diamond', icon: '💎', color: '#60a5fa', next: null, nextAt: null };
  if (count >= 10) return { name: 'Gold', icon: '🥇', color: '#f59e0b', next: 'Diamond', nextAt: 20 };
  if (count >= 5)  return { name: 'Silver', icon: '🥈', color: '#94a3b8', next: 'Gold', nextAt: 10 };
  return { name: 'Bronze', icon: '🥉', color: '#d97706', next: 'Silver', nextAt: 5 };
};

// Check achievements based on booking history — includes which bookings unlocked them
const getAchievements = (bookings) => {
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const courtSet = new Set(bookings.map((b) => b.court?.toString()));
  const totalHours = confirmed.reduce((s, b) => s + (b.duration || 0), 0);
  const totalSpent = confirmed.reduce((s, b) => s + (b.total_price || 0), 0);

  // Helper: get the Nth booking (sorted oldest first)
  const sortedAsc = [...bookings].reverse();
  const nthBooking = (n) => sortedAsc[n - 1];
  const bookingInfo = (b) => b ? { court: b.court?.name || 'Court', date: b.date, time: b.start_time } : null;

  // Find the 2nd unique court booking
  const firstCourts = [];
  const secondCourtBooking = sortedAsc.find((b) => {
    const cid = b.court?.toString();
    if (!firstCourts.includes(cid)) firstCourts.push(cid);
    return firstCourts.length >= 2;
  });

  // Find the booking that crossed 10 hours
  let runningHours = 0;
  const marathonBooking = [...confirmed].reverse().find((b) => {
    runningHours += b.duration || 0;
    return runningHours >= 10;
  });

  // Find the booking that crossed R5000
  let runningSpent = 0;
  const spenderBooking = [...confirmed].reverse().find((b) => {
    runningSpent += b.total_price || 0;
    return runningSpent >= 5000;
  });

  const achievements = [
    {
      id: 'first_booking',
      name: 'First Touch',
      desc: 'Made your first booking',
      icon: '⚽',
      unlocked: bookings.length >= 1,
      rarity: 'common',
      unlockedBy: bookingInfo(nthBooking(1)),
    },
    {
      id: 'hat_trick',
      name: 'Hat Trick',
      desc: 'Completed 3 bookings',
      icon: '🎯',
      unlocked: bookings.length >= 3,
      rarity: 'common',
      unlockedBy: bookingInfo(nthBooking(3)),
    },
    {
      id: 'regular',
      name: 'Pitch Regular',
      desc: 'Completed 5 bookings',
      icon: '🏃',
      unlocked: bookings.length >= 5,
      rarity: 'uncommon',
      unlockedBy: bookingInfo(nthBooking(5)),
    },
    {
      id: 'explorer',
      name: 'Court Explorer',
      desc: 'Booked 2 different courts',
      icon: '🗺️',
      unlocked: courtSet.size >= 2,
      rarity: 'uncommon',
      unlockedBy: secondCourtBooking ? bookingInfo(secondCourtBooking) : null,
    },
    {
      id: 'marathon',
      name: 'Marathon Man',
      desc: 'Accumulated 10+ hours on the pitch',
      icon: '⏱️',
      unlocked: totalHours >= 10,
      rarity: 'rare',
      unlockedBy: marathonBooking ? bookingInfo(marathonBooking) : null,
    },
    {
      id: 'veteran',
      name: 'Arena Veteran',
      desc: 'Completed 10 bookings',
      icon: '🏆',
      unlocked: bookings.length >= 10,
      rarity: 'rare',
      unlockedBy: bookingInfo(nthBooking(10)),
    },
    {
      id: 'big_spender',
      name: 'Big Spender',
      desc: 'Spent over R5,000 at the arena',
      icon: '💸',
      unlocked: totalSpent >= 5000,
      rarity: 'epic',
      unlockedBy: spenderBooking ? bookingInfo(spenderBooking) : null,
    },
    {
      id: 'legend',
      name: '5S Legend',
      desc: 'Completed 20 bookings — true arena royalty',
      icon: '👑',
      unlocked: bookings.length >= 20,
      rarity: 'legendary',
      unlockedBy: bookingInfo(nthBooking(20)),
    },
  ];

  return achievements;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await connectDB();

  const bookings = await Booking.find({ user: session.user.id })
    .populate('court', 'name')
    .sort({ date: -1 });

  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const totalHours = confirmed.reduce((s, b) => s + (b.duration || 0), 0);
  const totalSpent = confirmed.reduce((s, b) => s + (b.total_price || 0), 0);
  const courtsVisited = new Set(bookings.map((b) => b.court?.name).filter(Boolean));
  const tier = getTier(confirmed.length);
  const achievements = getAchievements(bookings);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Points: 100 per confirmed booking + 50 per hour + bonus for tier
  const points = confirmed.length * 100 + totalHours * 50;

  // Find highest point-earning court
  const courtPoints = {};
  confirmed.forEach((b) => {
    const courtName = b.court?.name || 'Unknown';
    const bookingPoints = 100 + (b.duration || 0) * 50;
    courtPoints[courtName] = (courtPoints[courtName] || 0) + bookingPoints;
  });
  const topCourt = Object.entries(courtPoints).sort(([, a], [, b]) => b - a)[0];
  const topCourtData = topCourt ? { name: topCourt[0], points: topCourt[1] } : null;

  // Recent bookings (last 5)
  const recent = bookings.slice(0, 5).map((b) => ({
    _id: b._id,
    courtName: b.court?.name || 'Court',
    date: b.date,
    start_time: b.start_time,
    duration: b.duration,
    total_price: b.total_price,
    status: b.status,
  }));

  return NextResponse.json({
    tier,
    points,
    totalBookings: confirmed.length,
    totalHours,
    totalSpent,
    courtsVisited: courtsVisited.size,
    achievements,
    unlockedCount,
    recent,
    memberSince: bookings.length > 0 ? bookings[bookings.length - 1].createdAt : null,
    topCourt: topCourtData,
  });
}
