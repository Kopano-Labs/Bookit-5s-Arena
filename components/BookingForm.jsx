'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const BookingForm = ({ courtId, courtName, pricePerHour }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPrice = pricePerHour * Number(duration);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!session) {
      router.push('/login');
      return;
    }

    if (!date || !startTime || !duration) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courtId,
        date,
        start_time: startTime,
        duration: Number(duration),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Failed to create booking. Please try again.');
      return;
    }

    const encodedName = encodeURIComponent(courtName || courtId);
    router.push(
      `/bookings/success?court=${encodedName}&date=${date}&time=${startTime}&duration=${duration}&total=${totalPrice}`
    );
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Book this Court</h2>

      {!session && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
          You need to{' '}
          <a href="/login" className="font-semibold underline">
            sign in
          </a>{' '}
          to book a court.
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min="10:00"
              max="21:00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
        </div>

        {date && startTime && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            <span className="font-semibold">Total: </span>R{totalPrice}{' '}
            <span className="text-gray-500">({duration} hr × R{pricePerHour}/hr)</span>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : session ? 'Book Court' : 'Sign In to Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
