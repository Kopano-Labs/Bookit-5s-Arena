'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Heading from '@/components/Heading';
import { FaCheckCircle, FaFutbol, FaCalendarAlt, FaClock } from 'react-icons/fa';

const BookingSuccessPage = () => {
  const searchParams = useSearchParams();

  const courtId = searchParams.get('court') ?? '—';
  const date = searchParams.get('date') ?? '—';
  const startTime = searchParams.get('time') ?? '—';
  const duration = searchParams.get('duration') ?? '1';
  const total = searchParams.get('total') ?? '—';

  return (
    <>
      <Heading title="Booking Confirmed" />
      <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-10 mt-4 text-center">
        <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">You&apos;re booked!</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Your booking has been confirmed. See you on the pitch!
        </p>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5 text-left space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaFutbol className="text-gray-400" />
            <span><span className="font-semibold">Court ID:</span> {courtId}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaCalendarAlt className="text-gray-400" />
            <span>
              <span className="font-semibold">Date:</span>{' '}
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
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaClock className="text-gray-400" />
            <span>
              <span className="font-semibold">Time:</span> {startTime} ·{' '}
              {duration} hour{Number(duration) > 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-800 pt-1 border-t border-gray-200">
            Total Paid: R{total}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/bookings"
            className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-700 text-sm"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
          >
            Browse More Courts
          </Link>
        </div>
      </div>
    </>
  );
};

export default BookingSuccessPage;
