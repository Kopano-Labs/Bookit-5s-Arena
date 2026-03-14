'use client';

export const metadata = { title: 'My Bookings', description: 'View and manage your 5s Arena court bookings.' };

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFutbol, FaCalendarAlt, FaClock, FaTrash, FaArrowRight } from 'react-icons/fa';

const statusStyles = {
  confirmed: 'bg-green-900/40 text-green-400 border border-green-800/60',
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-800/60',
  cancelled: 'bg-red-900/40 text-red-400 border border-red-800/60',
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch {
      setError('Could not load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } else {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            My Bookings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your court reservations</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-green-400 animate-pulse text-lg">
            Loading your bookings...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center shadow-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 border border-gray-700 mb-6">
              <FaFutbol className="text-4xl text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-semibold mb-2">No bookings yet</p>
            <p className="text-gray-600 text-sm mb-8">Ready to hit the pitch? Book a court now.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                boxShadow: '0 0 20px rgba(34,197,94,0.35)',
              }}
            >
              Browse Courts <FaArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-lg hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {booking.court?.image && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-700">
                      <Image
                        src={`/images/courts/${booking.court.image}`}
                        alt={booking.court.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white">
                      {booking.court?.name ?? 'Court'}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <FaCalendarAlt className="text-green-500 flex-shrink-0" size={11} />
                      {new Date(booking.date).toLocaleDateString('en-ZA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <FaClock className="text-green-500 flex-shrink-0" size={11} />
                      {booking.start_time} · {booking.duration} hour{booking.duration > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm font-bold text-green-400">
                      R{booking.total_price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[booking.status] ?? statusStyles.pending}`}>
                    {booking.status}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/bookings/${booking._id}`}
                      className="text-xs px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-all flex items-center gap-1"
                    >
                      View <FaArrowRight size={9} />
                    </Link>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-xs px-3 py-2 bg-red-950 border border-red-900 rounded-xl text-red-400 hover:bg-red-900/50 hover:border-red-700 transition-all flex items-center gap-1"
                      >
                        <FaTrash size={9} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
