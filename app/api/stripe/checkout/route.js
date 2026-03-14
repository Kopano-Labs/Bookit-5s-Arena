import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// POST /api/stripe/checkout — validates booking, creates pending DB record, returns Stripe checkout URL
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'You must be logged in to book a court' }, { status: 401 });
  }

  try {
    const { courtId, date, start_time, duration } = await request.json();

    if (!courtId || !date || !start_time || !duration) {
      return Response.json({ error: 'Court, date, start time and duration are required' }, { status: 400 });
    }

    await connectDB();

    const court = await Court.findById(courtId);
    if (!court) return Response.json({ error: 'Court not found' }, { status: 404 });

    // Validate time window
    const OPEN = 10 * 60;
    const CLOSE = 22 * 60;
    const newStart = toMinutes(start_time);
    const newEnd = newStart + duration * 60;

    if (newStart < OPEN || newEnd > CLOSE) {
      return Response.json({ error: 'Bookings must start at 10:00 and end by 22:00.' }, { status: 400 });
    }

    // Check for overlapping bookings
    const sameDayBookings = await Booking.find({
      court: courtId,
      date,
      status: { $ne: 'cancelled' },
    }).select('start_time duration');

    const hasOverlap = sameDayBookings.some((b) => {
      const existStart = toMinutes(b.start_time);
      const existEnd = existStart + b.duration * 60;
      return newStart < existEnd && newEnd > existStart;
    });

    if (hasOverlap) {
      return Response.json(
        { error: 'This court is already booked during that time. Please choose a different slot.' },
        { status: 409 }
      );
    }

    const total_price = court.price_per_hour * duration;

    // Create pending booking in DB
    const booking = await Booking.create({
      court: courtId,
      user: session.user.id,
      date,
      start_time,
      duration,
      total_price,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: {
              name: `${court.name} — Court Booking`,
              description: `${date} at ${start_time} · ${duration} hour${duration > 1 ? 's' : ''}`,
            },
            unit_amount: Math.round(total_price * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: session.user.email,
      success_url: `${siteUrl}/bookings/success?bookingId=${booking._id}`,
      cancel_url: `${siteUrl}/courts/${courtId}?cancelled=1`,
      metadata: {
        bookingId: booking._id.toString(),
        userEmail: session.user.email,
        userName: session.user.name,
      },
    });

    // Save Stripe session ID to booking
    booking.stripeSessionId = checkoutSession.id;
    await booking.save();

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: 'Failed to initiate payment. Please try again.' }, { status: 500 });
  }
}
