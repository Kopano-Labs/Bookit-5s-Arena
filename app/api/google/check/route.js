import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import GoogleApiConfig from '@/models/GoogleApiConfig';

// GET /api/google/check?api=maps — public endpoint to check if an API is enabled/visible
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('api');

  if (!apiKey) {
    return Response.json({ error: 'api param required' }, { status: 400 });
  }

  await connectDB();
  const config = await GoogleApiConfig.findOne({ apiKey }).lean();

  if (!config) {
    return Response.json({ enabled: false, visible: false });
  }

  if (!config.enabled) {
    return Response.json({ enabled: false, visible: false });
  }

  // Determine user's role
  const session = await getServerSession(authOptions);
  const role = session?.user?.activeRole || 'guest';
  const visibleTo = config.visibleTo || {};
  const visible = !!visibleTo[role];

  return Response.json({
    enabled: true,
    visible,
    config: visible ? config.settings : null,
  });
}
