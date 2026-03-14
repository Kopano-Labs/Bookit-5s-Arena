import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET — admin only: list all newsletter subscribers
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorised' }, { status: 401 });
  if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

  await connectDB();
  const subscribers = await User.find({ newsletterOptIn: true })
    .select('name email username createdAt')
    .sort({ createdAt: -1 });

  return Response.json({
    count: subscribers.length,
    subscribers: subscribers.map((u) => ({
      name: u.name,
      email: u.email,
      username: u.username,
      joinedAt: u.createdAt,
    })),
  });
}
