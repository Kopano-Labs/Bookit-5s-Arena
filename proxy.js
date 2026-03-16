import { NextResponse } from 'next/server';

export function proxy(request) {
  const response = NextResponse.next();

  // ── Security Headers (Helmet-equivalent for Next.js) ──
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS — only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com https://www.youtube.com https://s.ytimg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      [
        "connect-src 'self'",
        "https://accounts.google.com",
        "https://www.googleapis.com",
        "https://get.geojs.io",
        "https://api.open-meteo.com",
        "https://v2.jokeapi.dev",
        "https://www.thesportsdb.com",
        "https://api.groq.com",
        "https://api.anthropic.com",
      ].join(' '),
      "frame-src 'self' https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' https://www.youtube.com https://i.ytimg.com",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
