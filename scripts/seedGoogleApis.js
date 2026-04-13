/**
 * Seed default Google API configurations into MongoDB.
 * Run: node scripts/seedGoogleApis.js
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import GoogleApiConfig from '../models/GoogleApiConfig.js';

const MONGODB_URI = process.env.MONGODB_URI;

const DEFAULTS = [
  {
    apiKey: 'maps',
    label: 'Google Maps & Places',
    description: 'Interactive venue map, directions to Hellenic FC, nearby amenities',
    enabled: false,
    configured: false,
    visibleTo: { guest: true, user: true, manager: true, admin: true },
    settings: {
      venueAddress: 'Hellenic Football Club, Milnerton, Cape Town',
      venueLat: -33.8688,
      venueLng: 18.5228,
      zoomLevel: 15,
      showDirections: true,
    },
  },
  {
    apiKey: 'calendar',
    label: 'Google Calendar Sync',
    description: 'Add bookings to Google Calendar, sync match schedules',
    enabled: false,
    configured: false,
    visibleTo: { guest: false, user: true, manager: true, admin: true },
    settings: { autoSync: false, defaultReminder: 60 },
  },
  {
    apiKey: 'analytics',
    label: 'Google Analytics 4',
    description: 'Site traffic, page views, user behaviour in admin dashboard',
    enabled: false,
    configured: false,
    visibleTo: { guest: false, user: false, manager: true, admin: true },
    settings: { measurementId: '', trackingEnabled: false },
  },
  {
    apiKey: 'recaptcha',
    label: 'reCAPTCHA Enterprise',
    description: 'Bot protection on login, register, and booking forms',
    enabled: true,
    configured: true,
    visibleTo: { guest: true, user: true, manager: true, admin: true },
    settings: { threshold: 0.5, protectedPages: ['login', 'register', 'booking'] },
  },
  {
    apiKey: 'youtube',
    label: 'YouTube Data API',
    description: 'Auto-import match highlights, training videos, live streams',
    enabled: false,
    configured: false,
    visibleTo: { guest: true, user: true, manager: true, admin: true },
    settings: { channelIds: [], autoImport: false, maxResults: 10 },
  },
  {
    apiKey: 'sheets',
    label: 'Google Sheets Export',
    description: 'One-click export of bookings, users, financials to Google Sheets',
    enabled: false,
    configured: false,
    visibleTo: { guest: false, user: false, manager: true, admin: true },
    settings: { exportFormats: ['bookings', 'users', 'revenue'] },
  },
  {
    apiKey: 'gmail',
    label: 'Gmail API',
    description: 'Send transactional emails via Gmail (supplement Resend)',
    enabled: false,
    configured: false,
    visibleTo: { guest: false, user: false, manager: false, admin: true },
    settings: { fromName: '5s Arena', useAsBackup: true },
  },
  {
    apiKey: 'search',
    label: 'Google Search Console',
    description: 'SEO performance, search queries, indexing status',
    enabled: true,
    configured: true,
    visibleTo: { guest: false, user: false, manager: false, admin: true },
    settings: { siteUrl: 'https://fivesarena.com' },
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const config of DEFAULTS) {
    await GoogleApiConfig.findOneAndUpdate(
      { apiKey: config.apiKey },
      { $setOnInsert: config },
      { upsert: true, new: true },
    );
    console.log(`  ✔ ${config.label}`);
  }

  console.log('Google API configs seeded.');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
