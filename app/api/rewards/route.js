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

// Check achievements based on booking history
const getAchievements = (bookings) => {
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const courts = new Set(bookings.map((b) => b.court?.toString()));
  const sortedByDate = [...bookings].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Helper to find the Nth booking (sorted by date)
  const nthBooking = (n) => sortedByDate[n - 1];
  const formatUnlockInfo = (booking) => {
    if (!booking) return {};
    return {
      unlockedAt: booking.date,
      unlockedCourt: booking.court?.name || 'Court',
    };
  };

  // Find the booking that caused explorer unlock (2nd unique court)
  const explorerBooking = (() => {
    const seen = new Set();
    for (const b of sortedByDate) {
      seen.add(b.court?.toString());
      if (seen.size >= 2) return b;
    }
    return null;
  })();

  // Find when total hours crossed 10
  const marathonBooking = (() => {
    let total = 0;
    for (const b of confirmed.sort((a, b) => new Date(a.date) - new Date(b.date))) {
      total += b.duration || 0;
      if (total >= 10) return b;
    }
    return null;
  })();

  // Find when total spent crossed R5000
  const spenderBooking = (() => {
    let total = 0;
    for (const b of confirmed.sort((a, b) => new Date(a.date) - new Date(b.date))) {
      total += b.total_price || 0;
      if (total >= 5000) return b;
    }
    return null;
  })();

  const achievements = [
    {
      id: 'first_booking',
      name: 'First Touch',
      desc: 'Made your first booking',
      icon: '⚽',
      unlocked: bookings.length >= 1,
      rarity: 'common',
      ...formatUnlockInfo(nthBooking(1)),
    },
    {
      id: 'hat_trick',
      name: 'Hat Trick',
      desc: 'Completed 3 bookings',
      icon: '🎯',
      unlocked: bookings.length >= 3,
      rarity: 'common',
      ...formatUnlockInfo(nthBooking(3)),
    },
    {
      id: 'regular',
      name: 'Pitch Regular',
      desc: 'Completed 5 bookings',
      icon: '🏃',
      unlocked: bookings.length >= 5,
      rarity: 'uncommon',
      ...formatUnlockInfo(nthBooking(5)),
    },
    {
      id: 'explorer',
      name: 'Court Explorer',
      desc: 'Booked 2 different courts',
      icon: '🗺️',
      unlocked: courts.size >= 2,
      rarity: 'uncommon',
      ...formatUnlockInfo(explorerBooking),
    },
    {
      id: 'marathon',
      name: 'Marathon Man',
      desc: 'Accumulated 10+ hours on the pitch',
      icon: '⏱️',
      unlocked: confirmed.reduce((s, b) => s + (b.duration || 0), 0) >= 10,
      rarity: 'rare',
      ...formatUnlockInfo(marathonBooking),
    },
    {
      id: 'veteran',
      name: 'Arena Veteran',
      desc: 'Completed 10 bookings',
      icon: '🏆',
      unlocked: bookings.length >= 10,
      rarity: 'rare',
      ...formatUnlockInfo(nthBooking(10)),
    },
    {
      id: 'big_spender',
      name: 'Big Spender',
      desc: 'Spent over R5,000 at the arena',
      icon: '💸',
      unlocked: confirmed.reduce((s, b) => s + (b.total_price || 0), 0) >= 5000,
      rarity: 'epic',
      ...formatUnlockInfo(spenderBooking),
    },
    {
      id: 'legend',
      name: '5S Legend',
      desc: 'Completed 20 bookings — true arena royalty',
      icon: '👑',
      unlocked: bookings.length >= 20,
      rarity: 'legendary',
      ...formatUnlockInfo(nthBooking(20)),
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
  });
}
