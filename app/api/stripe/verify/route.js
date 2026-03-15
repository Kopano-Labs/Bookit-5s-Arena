import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingConfirmation } from '@/lib/sendBookingConfirmation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/verify
// Called from the success page immediately after Stripe redirect.
// Verifies the Stripe session is actually paid and syncs booking status.
// This is a safety net for when the webhook hasn't fired yet.
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { bookingId } = await request.json();
    if (!bookingId) return Response.json({ error: 'Missing bookingId' }, { status: 400 });

    // Validate ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(bookingId)) {
      return Response.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findById(bookingId).populate('court', 'name image');
    if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });

    // Verify the logged-in user owns this booking (prevent IDOR)
    if (!booking.user || booking.user.toString() !== session.user.id) {
      return Response.json({ error: 'Not authorised' }, { status: 403 });
    }

    // Already confirmed and paid — just return populated booking
    if (booking.paymentStatus === 'paid') {
      return Response.json(booking);
    }

    // Check with Stripe directly to confirm payment
    if (booking.stripeSessionId) {
      const stripeSession = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);

      if (stripeSession.payment_status === 'paid') {
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        await booking.save();

        // Send confirmation email (non-blocking)
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
          console.error('Verify: email send failed:', emailErr);
        }
      }
    }

    // Re-fetch with full court population for the success page
    const updated = await Booking.findById(bookingId).populate('court', 'name image');
    return Response.json(updated);
  } catch (error) {
    console.error('Stripe verify error:', error);
    return Response.json({ error: 'Verification failed' }, { status: 500 });
  }
}
