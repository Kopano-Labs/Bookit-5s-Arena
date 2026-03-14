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
import { motion } from 'framer-motion';
import InfoTooltip from '@/components/InfoTooltip';

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
  const [selectedCourt, setSelectedCourt] = useState(null);

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
      tip: 'All bookings across all statuses (confirmed, pending and cancelled) for the selected date range.',
    },
    {
      label: 'Total Revenue',
      value: `R${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl text-green-400" />,
      bg: 'bg-green-900/20 border-green-800/40',
      sub: `Avg R${stats.avgBookingValue}/booking`,
      sub2: stats.paidCount > 0 ? `R${(stats.paidRevenue ?? 0).toLocaleString()} confirmed paid` : null,
      tip: 'Total revenue across confirmed bookings. "Confirmed paid" reflects only those with payment verified via Stripe or manually marked paid.',
    },
    {
      label: 'Total Courts',
      value: stats.totalCourts,
      icon: <FaFutbol className="text-2xl text-yellow-400" />,
      bg: 'bg-yellow-900/20 border-yellow-800/40',
      sub: stats.mostBookedCourt ? `⭐ ${stats.mostBookedCourt.name}` : 'No data yet',
      tip: 'Number of active courts on the platform. ⭐ indicates your most popular court by booking count.',
    },
    {
      label: 'Registered Users',
      value: stats.totalUsers,
      icon: <FaUsers className="text-2xl text-purple-400" />,
      bg: 'bg-purple-900/20 border-purple-800/40',
      sub: 'Total accounts',
      tip: 'Total registered member accounts. Guest bookings (pay at venue) are not counted here.',
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-950 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
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
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/admin/bookings" className="px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest">
                Manage Bookings
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/admin/analytics" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest">
                <FaChartBar size={11} /> Analytics
              </Link>
            </motion.div>
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
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="visible"
        >
          {topCards.map((card) => (
            <motion.div
              key={card.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
              className={`border rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-lg ${card.bg}`}
            >
              <div className="p-3 rounded-xl bg-gray-900/60">{card.icon}</div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide leading-tight flex items-center gap-1">
                {card.label} <InfoTooltip text={card.tip} position="bottom" size={12} />
              </p>
              <p className="text-xs text-gray-600">{card.sub}</p>
              {card.sub2 && <p className="text-xs text-green-500 font-semibold">{card.sub2}</p>}
            </motion.div>
          ))}
        </motion.div>

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
                    <motion.div
                      className="w-full rounded-t-lg transition-all duration-500 relative group"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      style={{
                        height: `${Math.max(heightPct, day.revenue > 0 ? 8 : 2)}%`,
                        background: day.revenue > 0
                          ? 'linear-gradient(to top, #15803d, #22c55e)'
                          : 'rgba(55,65,81,0.5)',
                        minHeight: '4px',
                        transformOrigin: 'bottom',
                      }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {day.bookings} booking{day.bookings !== 1 ? 's' : ''} · R{day.revenue}
                      </div>
                    </motion.div>
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
                  <InfoTooltip text="The most popular start times based on confirmed bookings. Use this to plan staffing and promotions during quieter periods." position="left" size={12} />
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

        {/* Payment Status panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5 flex items-center gap-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            <FaMoneyBillWave className="text-green-400" /> Payment Status
            <InfoTooltip text="Paid = Stripe payment verified or manually marked paid. Confirmed Unpaid = booking is confirmed but payment not yet received — action may be needed. Refunded = Stripe refund processed." position="right" />
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Paid', count: stats.paidCount ?? 0, color: '#22c55e', textColor: 'text-green-400', icon: '✅' },
              { label: 'Confirmed Unpaid', count: stats.unpaidConfirmed ?? 0, color: '#f59e0b', textColor: 'text-amber-400', icon: '⚠️' },
              { label: 'Refunded', count: stats.refundedCount ?? 0, color: '#60a5fa', textColor: 'text-blue-400', icon: '🔄' },
            ].map((s) => {
              const total = (stats.paidCount ?? 0) + (stats.unpaidConfirmed ?? 0) + (stats.refundedCount ?? 0);
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`flex items-center gap-2 text-xs ${s.textColor}`}>
                      <span>{s.icon}</span> {s.label}
                    </div>
                    <span className="text-xs font-bold text-white">{s.count} <span className="text-gray-600">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Court Breakdown + Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Court Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div
              className={`px-6 py-4 border-b border-gray-800 flex items-center gap-2 ${selectedCourt ? 'cursor-pointer hover:bg-gray-800/40 transition-colors' : ''}`}
              onClick={() => selectedCourt && setSelectedCourt(null)}
              title={selectedCourt ? 'Click to view all courts' : ''}
            >
              <FaStar className={`${selectedCourt ? 'text-green-400' : 'text-yellow-400'} transition-colors`} />
              <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${selectedCourt ? 'text-green-400' : 'text-white'}`} style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                Court Performance
                {selectedCourt && <span className="text-[10px] text-green-500 font-normal normal-case tracking-normal">(click to reset view)</span>}
              </h3>
            </div>
            {stats.courtBreakdown.length === 0 ? (
              <p className="text-center py-10 text-gray-600 text-sm">No bookings in this period.</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {stats.courtBreakdown.map((c, i) => {
                  const pct = stats.totalBookings > 0 ? Math.round((c.bookings / stats.totalBookings) * 100) : 0;
                  const isSelected = selectedCourt === c.name;
                  return (
                    <motion.div
                      key={c._id}
                      onClick={() => setSelectedCourt(isSelected ? null : c.name)}
                      className={`px-6 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-green-900/20 border-l-2 border-green-500' : 'hover:bg-gray-800/40'}`}
                      whileHover={{ backgroundColor: 'rgba(31,41,55,0.6)', x: 2, transition: { duration: 0.15 } }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">{i + 1}</span>
                          <span className={`font-semibold text-sm ${isSelected ? 'text-green-400' : 'text-white'}`}>{c.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-400 text-sm">R{c.revenue.toLocaleString()}</span>
                          <span className="text-gray-600 text-xs ml-2">· {c.bookings} bookings · {pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #15803d, #22c55e)' }} />
                      </div>
                    </motion.div>
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
            {selectedCourt && (
              <div className="px-6 py-2.5 bg-green-900/20 border-b border-green-800/40 flex items-center justify-between">
                <span className="text-xs text-green-400 font-semibold">Viewing: {selectedCourt}</span>
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <FaTimes size={10} /> Clear
                </button>
              </div>
            )}
            {(() => {
              const filtered = selectedCourt
                ? (stats.recentBookings ?? []).filter((b) => b.courtName === selectedCourt)
                : (stats.recentBookings ?? []);
              return !filtered.length ? (
                <p className="text-center py-10 text-gray-600 text-sm">
                  {selectedCourt ? `No recent bookings for ${selectedCourt}.` : 'No bookings yet.'}
                </p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {filtered.map((b) => (
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
              );
            })()}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
