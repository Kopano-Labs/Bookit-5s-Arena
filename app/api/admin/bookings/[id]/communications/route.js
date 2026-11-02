export const dynamic = 'force-dynamic';
import { getAuthSession } from '@/lib/getSession';
import { requireRole } from '@/lib/roles';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import BookingDelivery from '@/models/BookingDelivery';
import { bookingScopeForAdmin } from '@/lib/bookings/arenaAccess';

export async function GET(request, { params }) {
  try {
    const session = await getAuthSession();
    if (!session) return Response.json({ error: 'Authentication required' }, { status: 401 });
    if (!requireRole(session, 'admin')) return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;
    if (!/^[a-fA-F0-9]{24}$/.test(id)) return Response.json({ error: 'Invalid booking ID' }, { status: 400 });
    await connectDB();
    const scope = await bookingScopeForAdmin(session);
    const booking = await Booking.findOne({ _id: id, ...scope }).select('_id');
    if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });
    const deliveries = await BookingDelivery.find({ booking: id }).select(
      'revision recipientType channel purpose status provider attempts lastAttemptAt sentAt error',
    ).sort({ revision: -1, createdAt: -1 }).limit(100).lean();
    return Response.json({ bookingId: id, deliveries, sentMeaning: 'Provider accepted; inbox delivery is not established.' });
  } catch {
    return Response.json({ error: 'Unable to load communication receipts' }, { status: 500 });
  }
}
