'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-brand-green">Something went wrong!</h2>
        <p className="text-gray-400">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-brand-green text-black font-semibold rounded-lg hover:bg-green-500 transition"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
