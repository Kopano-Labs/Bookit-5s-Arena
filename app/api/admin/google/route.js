import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import GoogleApiConfig from '@/models/GoogleApiConfig';
import { isSuperAdmin } from '@/lib/roles';

function forbidden() {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}

const SEED_DEFAULTS = [
  { apiKey: 'maps', label: 'Google Maps & Places', description: 'Interactive venue map, directions to Hellenic FC, nearby amenities', configured: false, visibleTo: { guest: true, user: true, manager: true, admin: true }, settings: { venueAddress: 'Hellenic Football Club, Milnerton, Cape Town', venueLat: -33.8688, venueLng: 18.5228, zoomLevel: 15, showDirections: true } },
  { apiKey: 'calendar', label: 'Google Calendar Sync', description: 'Add bookings to Google Calendar, sync match schedules', configured: false, visibleTo: { guest: false, user: true, manager: true, admin: true }, settings: { autoSync: false, defaultReminder: 60 } },
  { apiKey: 'analytics', label: 'Google Analytics 4', description: 'Site traffic, page views, user behaviour in admin dashboard', configured: false, visibleTo: { guest: false, user: false, manager: true, admin: true }, settings: { measurementId: '', trackingEnabled: false } },
  { apiKey: 'recaptcha', label: 'reCAPTCHA Enterprise', description: 'Bot protection on login, register, and booking forms', enabled: true, configured: true, visibleTo: { guest: true, user: true, manager: true, admin: true }, settings: { threshold: 0.5, protectedPages: ['login', 'register', 'booking'] } },
  { apiKey: 'youtube', label: 'YouTube Data API', description: 'Auto-import match highlights, training videos, live streams', configured: false, visibleTo: { guest: true, user: true, manager: true, admin: true }, settings: { channelIds: [], autoImport: false, maxResults: 10 } },
  { apiKey: 'sheets', label: 'Google Sheets Export', description: 'One-click export of bookings, users, financials to Google Sheets', configured: false, visibleTo: { guest: false, user: false, manager: true, admin: true }, settings: { exportFormats: ['bookings', 'users', 'revenue'] } },
  { apiKey: 'gmail', label: 'Gmail API', description: 'Send transactional emails via Gmail (supplement Resend)', configured: false, visibleTo: { guest: false, user: false, manager: false, admin: true }, settings: { fromName: '5s Arena', useAsBackup: true } },
  { apiKey: 'search', label: 'Google Search Console', description: 'SEO performance, search queries, indexing status', enabled: true, configured: true, visibleTo: { guest: false, user: false, manager: false, admin: true }, settings: { siteUrl: 'https://fivesarena.com' } },
];

async function ensureSeeded() {
  const count = await GoogleApiConfig.countDocuments();
  if (count === 0) {
    for (const d of SEED_DEFAULTS) {
      await GoogleApiConfig.create({ enabled: false, ...d });
    }
  }
}

// GET /api/admin/google — list all API configs
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.activeRole !== 'admin') return forbidden();

  await connectDB();
  await ensureSeeded();
  const configs = await GoogleApiConfig.find({}).sort({ label: 1 }).lean();
  return Response.json({ configs });
}

// PATCH /api/admin/google — toggle or update a single API config
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session || !isSuperAdmin(session.user.email)) return forbidden();

  const body = await request.json();
  const { apiKey, ...updates } = body;

  if (!apiKey) {
    return Response.json({ error: 'apiKey is required' }, { status: 400 });
  }

  // Only allow safe fields to be updated
  const allowed = ['enabled', 'visibleTo', 'settings'];
  const patch = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) patch[key] = updates[key];
  }

  await connectDB();
  const config = await GoogleApiConfig.findOneAndUpdate(
    { apiKey },
    { $set: patch },
    { new: true },
  );

  if (!config) {
    return Response.json({ error: 'API config not found' }, { status: 404 });
  }

  return Response.json({ config });
}
