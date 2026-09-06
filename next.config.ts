import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  compress: true,
  // Type errors are gated explicitly in CI before the production build.
  typescript: { ignoreBuildErrors: true },
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
      process.env.RECAPTCHA_SITE_KEY ||
      "",
  },
  serverExternalPackages: ["bcryptjs", "mongoose", "mongodb"],

  allowedDevOrigins: ["192.168.101.106", "*.local", "localhost"],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "crests.football-data.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.thesportsdb.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "media-1.api-sports.io" },
      { protocol: "https", hostname: "media-2.api-sports.io" },
      { protocol: "https", hostname: "media-3.api-sports.io" },
      { protocol: "https", hostname: "media-4.api-sports.io" },
      { protocol: "https", hostname: "resources.premierleague.com" },
      { protocol: "https", hostname: "www.isportsapi.com" },
      { protocol: "https", hostname: "*.isportsapi.com" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "news.fivesarena.com" }],
        destination: "/news?organ=news",
      },
      {
        source: "/",
        has: [{ type: "host", value: "blog.fivesarena.com" }],
        destination: "/news?organ=blog",
      },
    ];
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const headersArr = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://maps.googleapis.com https://plausible.io https://www.youtube.com https://s.ytimg.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://vercel.live https://*.vercel.live`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com https://assets.vercel.com",
              "connect-src 'self' https://api.open-meteo.com https://maps.googleapis.com https://*.google-analytics.com https://api.anthropic.com https://api.groq.com https://plausible.io https://vitals.vercel-insights.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://vercel.live https://*.vercel.live https://raw.githack.com https://raw.githubusercontent.com",
              "frame-src 'self' https://www.youtube.com https://www.dailymotion.com https://player.vimeo.com https://www.fifa.com https://uefa.tv https://maps.google.com https://www.google.com https://maps.googleapis.com https://www.recaptcha.net https://vercel.live https://*.vercel.live",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
    return headersArr;
  },
};

export default withBotId(nextConfig);
