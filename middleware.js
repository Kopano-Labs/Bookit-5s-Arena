import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role || 'guest';
    const path = req.nextUrl.pathname;

    // 1. Admin God-Mode Lockdown
    // Only users with role === 'admin' can access /admin route paths.
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 2. Manager Access
    // Only users with role === 'manager' or 'admin' can access /manager or /tournament/manager paths.
    if ((path.startsWith('/manager') || path.startsWith('/tournament/manager')) && role !== 'manager' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 3. Manager Isolation Requirement
    // The user requested: "Make sure that the manager dashboard is the ONLY page they can access".
    // Therefore, if a manager tries to browse the main site (/events, /competitions, /), we force them back to /manager.
    if (role === 'manager' && !path.startsWith('/manager') && !path.startsWith('/admin') && !path.startsWith('/api') && path !== '/tournament/manager') {
      return NextResponse.redirect(new URL('/manager', req.url));
    }

    // 4. Guest Restricted Access
    // The user requested: "Guest: ONLY Book Court, Events, Register for Competitions"
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

    return NextResponse.next();
  },
  {
    callbacks: {
      // The middleware should only run if the user is authenticated (except we want to lock out guests from /admin too)
      // By returning true, we ensure the middleware function itself handles the logic, 
      // but if we only want this to run on protected routes, we handle it below.
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // If they are trying to access protected routes, they MUST be logged in.
        if (path.startsWith('/admin') || path.startsWith('/manager') || path.startsWith('/tournament/manager') || path.startsWith('/user')) {
          return !!token;
        }
        // Otherwise, allow guests to browse normal pages, where the middleware will still execute to check for Manager isolation
        return true;
      }
    },
  }
);

export const config = {
  // Run on all paths except static assets, auth endpoints, and image optimization
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|login|register).*)'],
};
