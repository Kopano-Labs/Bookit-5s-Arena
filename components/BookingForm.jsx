'use client';

import { useState } from 'react';

const BookingForm = ({ courtId, pricePerHour }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = pricePerHour * Number(duration);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !startTime || !duration) {
      setError('Please fill in all fields.');
      return;
    }

    // TODO: Replace with real API call when backend is ready
    console.log('Booking submitted:', { courtId, date, startTime, duration, totalPrice });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
        <h2 className="text-lg font-bold">Booking Request Sent!</h2>
        <p className="mt-1 text-sm">
          You requested <strong>{courtId}</strong> on <strong>{date}</strong> at{' '}
          <strong>{startTime}</strong> for <strong>{duration} hour(s)</strong>.
        </p>
        <p className="mt-1 text-sm font-semibold">Total: R{totalPrice}</p>
        <button
          onClick={() => { setSubmitted(false); setDate(''); setStartTime(''); setDuration('1'); }}
          className="mt-3 text-sm underline text-green-700 hover:text-green-900"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Book this Court</h2>

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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          >
            Book Court
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;