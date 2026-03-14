import Stripe from 'stripe';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';
import User from '@/models/User';
import { sendBookingConfirmation } from '@/lib/sendBookingConfirmation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  // Read raw body for Stripe signature verification
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return Response.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  await connectDB();

  // ── Payment successful ──────────────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const stripeSession = event.data.object;
    const bookingId = stripeSession.metadata?.bookingId;

    if (!bookingId) {
      return Response.json({ received: true });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error('Webhook: booking not found', bookingId);
      return Response.json({ received: true });
    }

    // Only process once (idempotency)
    if (booking.paymentStatus === 'paid') {
      return Response.json({ received: true });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Send booking confirmation email
    try {
      const court = await Court.findById(booking.court);
      await sendBookingConfirmation({
        to: stripeSession.customer_email || stripeSession.metadata.userEmail,
        name: stripeSession.metadata.userName,
        courtName: court?.name || 'Court',
        date: booking.date,
        start_time: booking.start_time,
        duration: booking.duration,
        total_price: booking.total_price,
        type: 'confirmation',
      });
    } catch (emailError) {
      console.error('Webhook: failed to send confirmation email:', emailError);
    }
  }

  // ── Checkout expired (user abandoned payment) ──────────────────────────────
  if (event.type === 'checkout.session.expired') {
    const stripeSession = event.data.object;
    const bookingId = stripeSession.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'cancelled',
        paymentStatus: 'unpaid',
      });
    }
  }

  return Response.json({ received: true });
}
