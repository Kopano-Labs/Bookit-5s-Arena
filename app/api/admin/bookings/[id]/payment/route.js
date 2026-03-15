import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { paymentStatus } = await request.json();

  // Validate paymentStatus against allowed enum values
  const allowedStatuses = ['unpaid', 'paid', 'refunded', 'reserved'];
  if (!paymentStatus || !allowedStatuses.includes(paymentStatus)) {
    return Response.json({ error: 'Invalid payment status' }, { status: 400 });
  }

  const { id } = await params;

  // Validate ObjectId format
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return Response.json({ error: 'Invalid booking ID' }, { status: 400 });
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  );
  if (!booking) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true, booking });
}
