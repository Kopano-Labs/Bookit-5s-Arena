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
  const booking = await Booking.findByIdAndUpdate(
    params.id,
    { paymentStatus },
    { new: true }
  );
  if (!booking) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true, booking });
}
