'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  formatErrorDetails,
  shouldShowClientErrorDetails,
} from '@/lib/groundedErrorDetails';

export default function TournamentError({ error, reset }) {
  const showDetails = shouldShowClientErrorDetails();
  const detailText = useMemo(() => formatErrorDetails(error), [error]);

  useEffect(() => {
    console.error('[Tournament Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-3">Tournament Error</p>
        <h2 className="text-2xl font-black text-white uppercase mb-4" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          Something went wrong
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {showDetails && error?.message
            ? error.message
            : 'An unexpected error occurred on the tournament page.'}
        </p>
        {error?.digest ? (
          <p className="font-mono text-[11px] text-gray-500 break-all mb-4">
            Support reference: {error.digest}
          </p>
        ) : null}
        {showDetails && detailText ? (
          <details className="text-left mb-8 rounded-lg border border-gray-800 bg-black/40">
            <summary className="cursor-pointer px-3 py-2 text-xs text-gray-400 hover:text-gray-200">
              Technical details (dev or NEXT_PUBLIC_SHOW_ERROR_DETAILS)
            </summary>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap break-words px-3 pb-3 text-[11px] text-red-300/90">
              {detailText}
            </pre>
          </details>
        ) : null}
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={reset}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
