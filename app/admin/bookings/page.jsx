'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Heading from '@/components/Heading';

const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
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

  return (
    <>
      <Heading title="Manage Bookings" />
      <div className="max-w-6xl mx-auto mt-4 space-y-6">
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
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button onClick={fetchBookings}
            className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-700">
            Apply
          </button>
          <button onClick={() => { setFromDate(''); setToDate(''); setStatusFilter(''); }}
            className="border px-4 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Clear
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No bookings found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Court</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{b.user?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.court?.name ?? 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-700">{b.date}</td>
                    <td className="px-4 py-3 text-gray-700">{b.start_time}</td>
                    <td className="px-4 py-3 text-gray-700">{b.duration}h</td>
                    <td className="px-4 py-3 text-gray-700">R{b.total_price?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {b.status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        disabled={updating === b._id}
                        className="border rounded-md px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
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
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBookings;
