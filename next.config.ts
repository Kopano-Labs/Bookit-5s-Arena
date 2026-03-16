import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ['192.168.101.106', '*.local', 'localhost'],

  images: {
    remotePatterns: [
      // Football-data.org team crests (Premier League, La Liga, Serie A, Bundesliga)
      { protocol: 'https', hostname: 'crests.football-data.org' },
      // Wikipedia team logos (PSL clubs)
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // TheSportsDB team badges (live data)
      { protocol: 'https', hostname: 'www.thesportsdb.com' },
      // YouTube thumbnails
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      // Google user avatars (OAuth profile pictures)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // General HTTPS images (Unsplash, court photos, etc.)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
