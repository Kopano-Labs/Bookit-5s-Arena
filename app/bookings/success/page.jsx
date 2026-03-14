'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaFutbol, FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';

const BookingSuccessPage = () => {
  const searchParams = useSearchParams();

  const courtId   = searchParams.get('court')    ?? '—';
  const date      = searchParams.get('date')     ?? '—';
  const startTime = searchParams.get('time')     ?? '—';
  const duration  = searchParams.get('duration') ?? '1';
  const total     = searchParams.get('total')    ?? '—';

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg">

        {/* Glow card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">

          {/* Top strip */}
          <div className="bg-gradient-to-r from-green-900/60 to-gray-900 px-8 py-8 text-center border-b border-gray-800">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/40 border-2 border-green-500 mb-4 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <FaCheckCircle className="text-4xl text-green-400" />
            </div>
            <h1
              className="text-3xl font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              You&apos;re Booked!
            </h1>
            <p className="text-green-400 text-sm mt-2 font-semibold">
              Booking confirmed — see you on the pitch! ⚽
            </p>
          </div>

          {/* Details */}
          <div className="px-8 py-7 space-y-3">
            <div className="flex items-center gap-3 py-3 border-b border-gray-800">
              <FaFutbol className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 uppercase tracking-widest w-20">Court</span>
              <span className="text-white font-semibold">{courtId}</span>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-gray-800">
              <FaCalendarAlt className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 uppercase tracking-widest w-20">Date</span>
              <span className="text-white font-semibold">
                {date !== '—'
                  ? new Date(date).toLocaleDateString('en-ZA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-gray-800">
              <FaClock className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 uppercase tracking-widest w-20">Time</span>
              <span className="text-white font-semibold">
                {startTime} · {duration} hour{Number(duration) > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-3 py-4">
              <div className="w-4 flex-shrink-0" />
              <span className="text-xs text-gray-500 uppercase tracking-widest w-20">Total Paid</span>
              <span className="text-2xl font-black text-green-400">R{total}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/bookings"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                boxShadow: '0 0 20px rgba(34,197,94,0.3)',
              }}
            >
              View My Bookings <FaArrowRight size={11} />
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-gray-300 bg-gray-800 border border-gray-700 hover:border-gray-600 hover:text-white transition-all duration-300"
            >
              Browse More Courts
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
