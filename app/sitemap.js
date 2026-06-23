export default function sitemap() {
  const base = process.env.NEXTAUTH_URL || 'https://fivesarena.com';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: ${base}/bookings, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: ${base}/tournament, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: ${base}/fixtures, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: ${base}/leagues, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: ${base}/events-and-services, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: ${base}/pricing, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: ${base}/about, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: ${base}/contact, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: ${base}/rules-of-the-game, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: ${base}/login, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: ${base}/register, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: ${base}/privacy, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
