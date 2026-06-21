export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// Lazy-load NextAuth + authOptions to prevent webpack bundle crash during
// build-time "Collecting page data" phase.
let _handler;
async function getHandler() {
  if (!_handler) {
    const nextAuthModule = await import('next-auth');
    const NextAuth = nextAuthModule.default?.default || nextAuthModule.default;
    const { authOptions } = await import('@/lib/authOptions');
    _handler = NextAuth(authOptions);
  }
  return _handler;
}

export async function GET(req, ctx) {
  try {
    const handler = await getHandler();
    return handler(req, ctx);
  } catch (error) {
    console.error('[NEXTAUTH_FATAL_ERROR]', error);
    return NextResponse.json({ error: 'Auth Bootstrap Failed' }, { status: 500 });
  }
}

export async function POST(req, ctx) {
  try {
    const handler = await getHandler();
    return handler(req, ctx);
  } catch (error) {
    console.error('[NEXTAUTH_FATAL_ERROR]', error);
    return NextResponse.json({ error: 'Auth Bootstrap Failed' }, { status: 500 });
  }
}
