import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const role = req.nextauth.token?.role || 'guest';
    const path = req.nextUrl.pathname;

    // ── 1. Admin God-Mode Lockdown ──────────────────────────────────
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // ── 2. Manager Access ──────────────────────────────────────────
    if ((path.startsWith('/manager') || path.startsWith('/tournament/manager')) && role !== 'manager' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // ── 3. Manager Isolation Requirement ───────────────────────────
    if (role === 'manager' && !path.startsWith('/manager') && !path.startsWith('/admin') && !path.startsWith('/api') && path !== '/tournament/manager') {
      return NextResponse.redirect(new URL('/manager', req.url));
    }

    // ── 4. Guest Restricted Access ─────────────────────────────────
    if (role === 'guest') {
      const allowedPrefixes = [
        '/events',
        '/tournament',
        '/competitions',
        '/login',
        '/register',
        '/api',
        '/_next'
      ];
      const isAllowed = path === '/' || allowedPrefixes.some(p => path.startsWith(p));
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // ── 5. Standard Respone + Security Headers ─────────────────────
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

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
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin') || path.startsWith('/manager') || path.startsWith('/tournament/manager') || path.startsWith('/user')) {
          return !!token;
        }
        return true;
      }
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|login|register).*)'],
};
