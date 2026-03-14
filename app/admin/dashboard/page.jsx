'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaCalendarAlt, FaFutbol, FaMoneyBillWave, FaClock,
  FaFilter, FaTimes, FaUsers, FaCheckCircle, FaHourglassHalf,
  FaBan, FaArrowUp, FaChartBar, FaStar,
} from 'react-icons/fa';

const statusBadge = (status) => {
  const map = {
    confirmed: 'bg-green-900/40 text-green-400 border-green-700/50',
    pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
    cancelled: 'bg-red-900/40 text-red-400 border-red-700/50',
  };
  return map[status] || 'bg-gray-800 text-gray-400 border-gray-700';
};

const payBadge = (ps) => {
  const map = {
    paid: 'text-green-400',
    unpaid: 'text-gray-500',
    refunded: 'text-blue-400',
  };
  return map[ps] || 'text-gray-500';
};

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchStats = useCallback((params) => {
    const p = params || new URLSearchParams();
    if (!params) {
      if (fromDate) p.set('from', fromDate);
      if (toDate) p.set('to', toDate);
      if (statusFilter) p.set('status', statusFilter);
    }
    setLoading(true);
    fetch(`/api/admin/stats?${p.toString()}`)
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); });
  }, [fromDate, toDate, statusFilter]);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
    if (status === 'authenticated') fetchStats(new URLSearchParams());
  }, [status, session, router]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const inputClass = 'bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all';

  // Revenue trend bar chart
  const maxRevenue = Math.max(...(stats.revenueTrend?.map((d) => d.revenue) ?? [1]), 1);

  const topCards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarAlt className="text-2xl text-blue-400" />,
      bg: 'bg-blue-900/20 border-blue-800/40',
      sub: `${stats.upcomingBookings} upcoming`,
    },
    {
      label: 'Total Revenue',
      value: `R${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl text-green-400" />,
      bg: 'bg-green-900/20 border-green-800/40',
      sub: `Avg R${stats.avgBookingValue}/booking`,
    },
    {
      label: 'Total Courts',
      value: stats.totalCourts,
      icon: <FaFutbol className="text-2xl text-yellow-400" />,
      bg: 'bg-yellow-900/20 border-yellow-800/40',
      sub: stats.mostBookedCourt ? `⭐ ${stats.mostBookedCourt.name}` : 'No data yet',
    },
    {
      label: 'Registered Users',
      value: stats.totalUsers,
      icon: <FaUsers className="text-2xl text-purple-400" />,
      bg: 'bg-purple-900/20 border-purple-800/40',
      sub: 'Total accounts',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Revenue, bookings &amp; business insights</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/bookings" className="px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest">
              Manage Bookings
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest">
              <FaChartBar size={11} /> Analytics
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-wrap gap-4 items-end shadow-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Period</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="">All Bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <button
            onClick={() => fetchStats()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}
          >
            <FaFilter size={11} /> Apply
          </button>
          <button
            onClick={() => { setFromDate(''); setToDate(''); setStatusFilter(''); fetchStats(new URLSearchParams()); }}
            className="flex items-center gap-2 px-5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all"
          >
            <FaTimes size={11} /> Clear
          </button>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topCards.map((card) => (
            <div key={card.label} className={`border rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-lg ${card.bg}`}>
              <div className="p-3 rounded-xl bg-gray-900/60">{card.icon}</div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide leading-tight">{card.label}</p>
              <p className="text-xs text-gray-600">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Revenue trend + Status breakdown row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Revenue trend (last 7 days) */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <FaArrowUp className="text-green-400" /> Revenue — Last 7 Days
              </h3>
              <span className="text-xs text-gray-600">
                R{(stats.revenueTrend?.reduce((a, d) => a + d.revenue, 0) || 0).toLocaleString()} total
              </span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {stats.revenueTrend?.map((day) => {
                const heightPct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                const label = new Date(day.date + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'short' });
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-600">{day.revenue > 0 ? `R${day.revenue}` : ''}</span>
                    <div className="w-full rounded-t-lg transition-all duration-500 relative group"
                      style={{
                        height: `${Math.max(heightPct, day.revenue > 0 ? 8 : 2)}%`,
                        background: day.revenue > 0
                          ? 'linear-gradient(to top, #15803d, #22c55e)'
                          : 'rgba(55,65,81,0.5)',
                        minHeight: '4px',
                      }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {day.bookings} booking{day.bookings !== 1 ? 's' : ''} · R{day.revenue}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking status breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5 flex items-center gap-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              <FaChartBar className="text-blue-400" /> Booking Status
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Confirmed', count: stats.statusCounts?.confirmed ?? 0, icon: <FaCheckCircle className="text-green-400" />, color: '#22c55e' },
                { label: 'Pending', count: stats.statusCounts?.pending ?? 0, icon: <FaHourglassHalf className="text-yellow-400" />, color: '#eab308' },
                { label: 'Cancelled', count: stats.statusCounts?.cancelled ?? 0, icon: <FaBan className="text-red-400" />, color: '#ef4444' },
              ].map((s) => {
                const total = (stats.statusCounts?.confirmed ?? 0) + (stats.statusCounts?.pending ?? 0) + (stats.statusCounts?.cancelled ?? 0);
                const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400">{s.icon} {s.label}</div>
                      <span className="text-xs font-bold text-white">{s.count} <span className="text-gray-600">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Peak hours */}
            {stats.peakHours?.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <FaClock size={10} /> Peak Booking Hours
                </p>
                {stats.peakHours.slice(0, 3).map((h, i) => (
                  <div key={h.hour} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-gray-400">{i + 1}. {h.hour}</span>
                    <span className="text-xs font-bold text-green-400">{h.count} bookings</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Court Breakdown + Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Court Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                Court Performance
              </h3>
            </div>
            {stats.courtBreakdown.length === 0 ? (
              <p className="text-center py-10 text-gray-600 text-sm">No bookings in this period.</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {stats.courtBreakdown.map((c, i) => {
                  const pct = stats.totalBookings > 0 ? Math.round((c.bookings / stats.totalBookings) * 100) : 0;
                  return (
                    <div key={c._id} className="px-6 py-4 hover:bg-gray-800/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">{i + 1}</span>
                          <span className="font-semibold text-white text-sm">{c.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-400 text-sm">R{c.revenue.toLocaleString()}</span>
                          <span className="text-gray-600 text-xs ml-2">· {c.bookings} bookings · {pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #15803d, #22c55e)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <FaCalendarAlt className="text-blue-400" /> Recent Bookings
              </h3>
              <Link href="/admin/bookings" className="text-xs text-green-400 hover:text-green-300 transition-colors uppercase tracking-wide">
                View All →
              </Link>
            </div>
            {!stats.recentBookings?.length ? (
              <p className="text-center py-10 text-gray-600 text-sm">No bookings yet.</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {stats.recentBookings.map((b) => (
                  <div key={b._id} className="px-6 py-3.5 hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{b.courtName}</p>
                        <p className="text-gray-500 text-xs truncate">{b.userName} · {b.date} {b.start_time}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="font-bold text-green-400 text-sm">R{b.total_price}</span>
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wide ${statusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
