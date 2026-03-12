'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/Heading';
import { FaFutbol, FaCalendarAlt, FaClock, FaTrash } from 'react-icons/fa';

const statusStyles = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
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
    } catch (err) {
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
    <>
      <Heading title="My Bookings" />
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading your bookings...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <FaFutbol className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You have no bookings yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Browse Courts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white shadow rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  {booking.court?.image && (
                    <Image
                      src={`/images/courts/${booking.court.image}`}
                      alt={booking.court.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.court?.name ?? 'Court'}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(booking.date).toLocaleDateString('en-ZA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaClock className="text-gray-400" />
                      {booking.start_time} · {booking.duration} hour{booking.duration > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      Total: R{booking.total_price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/courts/${booking.court?._id}`}
                      className="text-sm px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      View Court
                    </Link>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-sm px-3 py-1 border border-red-200 text-red-500 rounded-md hover:bg-red-50 flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsPage;
