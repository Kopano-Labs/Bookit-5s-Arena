"use client";

/**
 * Catches errors in the root layout (and below) when the default error boundary cannot.
 * Must define its own <html> and <body> — see Next.js App Router global-error docs.
 */
export default function GlobalError({ error, reset }) {
  const showDetails =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_ADMIN_ERROR_DETAILS === "true";

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white antialiased flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-400">
            Arena unavailable
          </h1>
          <p className="text-gray-400 text-sm">
            A root-level error occurred. Use Try again, or return once the deployment
            health check passes.
          </p>
          {error?.digest ? (
            <p className="font-mono text-[11px] text-gray-500 break-all">
              Ref: {error.digest}
            </p>
          ) : null}
          {showDetails && error?.message ? (
            <pre className="text-left text-xs text-red-300/90 whitespace-pre-wrap break-words max-h-48 overflow-y-auto rounded-lg bg-black/40 p-3 border border-red-900/40">
              {error.message}
            </pre>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2 rounded-lg bg-green-600 text-black text-sm font-semibold hover:bg-green-500"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-5 py-2 rounded-lg border border-gray-600 text-sm text-gray-200 hover:bg-gray-900"
            >
              Return home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
