'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaFutbol, FaLock, FaCreditCard } from 'react-icons/fa';

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

    // Create checkout session via Stripe
    const res = await fetch('/api/stripe/checkout', {
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

    if (!res.ok) {
      setError(data.error || 'Failed to create booking. Please try again.');
      setLoading(false);
      return;
    }

    // Redirect to Stripe hosted checkout
    window.location.href = data.url;
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500';
  const labelClass = 'block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest';

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2
        className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2"
        style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
      >
        <FaFutbol className="text-green-400" /> Book This Court
      </h2>

      {!session && (
        <div className="mb-5 p-4 bg-yellow-900/30 border border-yellow-700/40 rounded-xl text-yellow-300 text-sm flex items-center gap-2">
          <FaLock className="flex-shrink-0" />
          <span>
            You need to{' '}
            <Link href="/login" className="font-bold underline hover:text-yellow-200">
              sign in
            </Link>{' '}
            to book a court.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-5 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}>
              <FaCalendarAlt className="inline mr-1.5 mb-0.5" />Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="start_time" className={labelClass}>
              <FaClock className="inline mr-1.5 mb-0.5" />Start Time
            </label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min="10:00"
              max="21:00"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className={labelClass}>
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputClass}
              required
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
        </div>

        {date && startTime && (
          <div className="p-4 bg-green-900/20 border border-green-800/40 rounded-xl text-sm text-green-300">
            <span className="font-bold text-white">Total: R{totalPrice}</span>
            <span className="text-green-500 ml-2">
              ({duration} hr × R{pricePerHour}/hr)
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
            boxShadow: '0 0 25px rgba(34,197,94,0.35)',
          }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to Payment...
            </>
          ) : session ? (
            <>
              <FaCreditCard size={14} />
              Pay & Book Court — R{totalPrice}
            </>
          ) : (
            'Sign In to Book'
          )}
        </button>

        {session && (
          <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1.5">
            <span>🔒</span> Secured by Stripe · Your card details are never stored on our servers
          </p>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
