"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  formatErrorDetails,
  shouldShowClientErrorDetails,
} from "@/lib/groundedErrorDetails";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const showDetails = shouldShowClientErrorDetails();
  const detailText = useMemo(() => formatErrorDetails(error), [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-brand-green">
          Something went wrong!
        </h2>
        <p className="text-gray-400">
          {showDetails && error?.message
            ? error.message
            : "An unexpected error occurred. Our team has been notified."}
        </p>
        {error?.digest ? (
          <p className="font-mono text-[11px] text-gray-500 break-all">
            Support reference: {error.digest}
          </p>
        ) : null}
        {showDetails && detailText ? (
          <details className="text-left rounded-lg border border-red-900/40 bg-black/40">
            <summary className="cursor-pointer px-3 py-2 text-xs text-gray-400 hover:text-gray-200">
              Technical details (dev or NEXT_PUBLIC_SHOW_ERROR_DETAILS)
            </summary>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap break-words px-3 pb-3 text-[11px] text-red-300/90">
              {detailText}
            </pre>
          </details>
        ) : null}
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Confirm the hostname matches production (
          <span className="text-gray-400">fivesarena.com</span>
          — a common typo is <span className="text-gray-500">livesarena.com</span>
          ). Check Vercel deployment logs and{" "}
          <code className="text-gray-400">NEXTAUTH_URL</code>, Mongo URI, and
          the latest successful commit on <code className="text-gray-400">main</code>.
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 bg-brand-green text-black font-semibold rounded-lg hover:bg-green-500 transition duration-300 shadow-md hover:scale-105 hover:shadow-green-400/40 active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition duration-300 hover:scale-105 hover:border-green-400 active:scale-95"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
