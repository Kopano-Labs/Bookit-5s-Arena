import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/auth/register
export async function POST(request) {
  try {
    const { name, email, password, recaptchaToken } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate types to prevent NoSQL injection
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input types' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // ── Verify Google reCAPTCHA token (server-side) ──────────────
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Please complete the reCAPTCHA check.' },
        { status: 400 }
      );
    }

    const recaptchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Only pass whitelisted fields — prevent mass-assignment (e.g. injecting role: 'admin')
    // Auto-subscribe to newsletter for all new users
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password, newsletterOptIn: true });

    return NextResponse.json(
      { message: 'Account created successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
