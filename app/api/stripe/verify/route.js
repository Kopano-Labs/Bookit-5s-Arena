import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Court from '@/models/Court';
import { sendBookingConfirmation } from '@/lib/sendBookingConfirmation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/verify — called from success page to proactively confirm a paid booking
// Acts as a reliable fallback in case the webhook hasn't fired yet
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { bookingId } = await request.json();
    if (!bookingId) {
      return Response.json({ error: 'bookingId is required' }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findById(bookingId).populate('court');
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Ensure the requester owns this booking (or is admin)
    if (booking.user.toString() !== session.user.id && session.user.role !== 'admin') {
      return Response.json({ error: 'Not authorised' }, { status: 403 });
    }

    // Already confirmed — just return it
    if (booking.paymentStatus === 'paid') {
      return Response.json(booking);
    }

    // Need a Stripe session ID to verify
    if (!booking.stripeSessionId) {
      return Response.json(booking);
    }

    // Ask Stripe directly whether the payment succeeded
    const stripeSession = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);

    if (stripeSession.payment_status === 'paid') {
      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      await booking.save();

      // Send confirmation email (idempotent — check hasn't been sent before)
      try {
        await sendBookingConfirmation({
          to: session.user.email,
          name: session.user.name,
          courtName: booking.court?.name || 'Court',
          date: booking.date,
          start_time: booking.start_time,
          duration: booking.duration,
          total_price: booking.total_price,
          type: 'confirmation',
        });
      } catch (emailErr) {
        console.error('Verify: failed to send confirmation email:', emailErr);
      }
    }

    return Response.json(booking);
  } catch (err) {
    console.error('Stripe verify error:', err);
    return Response.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
