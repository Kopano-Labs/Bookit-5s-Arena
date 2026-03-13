  'use client';

  import { useEffect, useState, useCallback } from 'react';
  import { useRouter } from 'next/navigation';
  import { useSession } from 'next-auth/react';
  import Heading from '@/components/Heading';
  import { FaCalendarAlt, FaFutbol, FaMoneyBillWave, FaClock } from 'react-icons/fa';

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
        .then((data) => {
          setStats(data);
          setLoading(false);
        });
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

    if (loading || !stats) return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;

    const cards = [
      { label: 'Total Bookings', value: stats.totalBookings, icon: <FaCalendarAlt className="text-2xl text-blue-500" /> },
      { label: 'Total Revenue', value: `R${stats.totalRevenue.toLocaleString()}`, icon: <FaMoneyBillWave className="text-2xl text-green-500" /> },
      { label: 'Total Courts', value: stats.totalCourts, icon: <FaFutbol className="text-2xl text-yellow-500" /> },
      { label: 'Upcoming Bookings', value: stats.upcomingBookings, icon: <FaClock className="text-2xl text-purple-500" /> },
    ];

    return (
      <>
        <Heading title="Admin Dashboard" />
        <div className="max-w-5xl mx-auto mt-4 space-y-6">

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm text-gray-700" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm text-gray-700" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm text-gray-700">
                <option value="">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <button onClick={fetchStats}
              className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-700">
              Apply
            </button>
            <button onClick={() => { setFromDate(''); setToDate(''); setStatusFilter(''); }}
              className="border px-4 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              Clear
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="bg-white shadow rounded-lg p-5 flex flex-col items-center text-center gap-2">
                {card.icon}
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Court Breakdown Table */}
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Court Breakdown</h3>
            {stats.courtBreakdown.length === 0 ? (
              <p className="text-sm text-gray-400">No bookings in this period.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-2 font-medium">Court</th>
                    <th className="pb-2 font-medium text-center">Bookings</th>
                    <th className="pb-2 font-medium text-right">Revenue</th>
                    <th className="pb-2 font-medium text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.courtBreakdown.map((c) => (
                    <tr key={c._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 font-medium text-gray-800">{c.name}</td>
                      <td className="py-2 text-center text-gray-600">{c.bookings}</td>
                      <td className="py-2 text-right text-gray-600">R{c.revenue.toLocaleString()}</td>
                      <td className="py-2 text-right text-gray-500">
                        {stats.totalBookings > 0 ? Math.round((c.bookings / stats.totalBookings) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </>
    );
  };

  export default AdminDashboard;
