'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCalendarAlt, FaFutbol, FaMoneyBillWave, FaClock, FaFilter, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchStats = useCallback(() => {
    const params = new URLSearchParams();
    if (fromDate) params.set('from', fromDate);
    if (toDate) params.set('to', toDate);
    if (statusFilter) params.set('status', statusFilter);
    setLoading(true);
    fetch(`/api/admin/stats?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => { setStats(data); setLoading(false); });
  }, [fromDate, toDate, statusFilter]);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
    if (status === 'authenticated') {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((data) => { setStats(data); setLoading(false); });
    }
  }, [status, session, router]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const inputClass = 'bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all';

  const cards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarAlt className="text-2xl text-blue-400" />,
      bg: 'bg-blue-900/20 border-blue-800/40',
    },
    {
      label: 'Total Revenue',
      value: `R${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl text-green-400" />,
      bg: 'bg-green-900/20 border-green-800/40',
    },
    {
      label: 'Total Courts',
      value: stats.totalCourts,
      icon: <FaFutbol className="text-2xl text-yellow-400" />,
      bg: 'bg-yellow-900/20 border-yellow-800/40',
    },
    {
      label: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      icon: <FaClock className="text-2xl text-purple-400" />,
      bg: 'bg-purple-900/20 border-purple-800/40',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div>
          <h1
            className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Revenue and booking statistics</p>
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
            onClick={fetchStats}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}
          >
            <FaFilter size={11} /> Apply
          </button>
          <button
            onClick={() => { setFromDate(''); setToDate(''); setStatusFilter(''); }}
            className="flex items-center gap-2 px-5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all"
          >
            <FaTimes size={11} /> Clear
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`border rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-lg ${card.bg}`}
            >
              <div className="p-3 rounded-xl bg-gray-900/60">
                {card.icon}
              </div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Court Breakdown Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3
              className="text-sm font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Court Breakdown
            </h3>
          </div>
          {stats.courtBreakdown.length === 0 ? (
            <p className="text-center py-10 text-gray-600 text-sm">No bookings in this period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Court</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Bookings</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Revenue</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">% Share</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.courtBreakdown.map((c) => (
                    <tr key={c._id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{c.name}</td>
                      <td className="px-6 py-4 text-center text-gray-300">{c.bookings}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-400">R{c.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {stats.totalBookings > 0 ? Math.round((c.bookings / stats.totalBookings) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
