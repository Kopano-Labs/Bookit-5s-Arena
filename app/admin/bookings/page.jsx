'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const STATUS_STYLES = {
  confirmed: 'bg-green-900/40 text-green-400 border border-green-800/60',
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-800/60',
  cancelled: 'bg-red-900/40 text-red-400 border border-red-800/60',
};

const AdminBookings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchBookings = useCallback(() => {
    const params = new URLSearchParams();
    if (fromDate) params.set('from', fromDate);
    if (toDate) params.set('to', toDate);
    if (statusFilter) params.set('status', statusFilter);
    setLoading(true);
    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => { setBookings(data); setLoading(false); });
  }, [fromDate, toDate, statusFilter]);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
    if (status === 'authenticated') {
      fetch('/api/admin/bookings')
        .then((res) => res.json())
        .then((data) => {
          setBookings(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
    );
    setUpdating(null);
  };

  const inputClass = 'bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all';

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page header */}
        <div>
          <h1
            className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Manage Bookings
          </h1>
          <p className="text-gray-500 text-sm mt-1">View and update all court reservations</p>
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
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={fetchBookings}
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

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <p className="text-center py-16 text-green-400 animate-pulse">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-16 text-gray-600">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Court</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Time</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Dur.</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{b.user?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.user?.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-300 font-medium">{b.court?.name ?? 'Unknown'}</td>
                      <td className="px-5 py-4 text-gray-400">{b.date}</td>
                      <td className="px-5 py-4 text-gray-400">{b.start_time}</td>
                      <td className="px-5 py-4 text-gray-400">{b.duration}h</td>
                      <td className="px-5 py-4 font-bold text-green-400">R{b.total_price?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[b.status] ?? 'bg-gray-800 text-gray-500'}`}>
                          {b.status ?? 'unknown'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          defaultValue={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          disabled={updating === b._id}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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

export default AdminBookings;
