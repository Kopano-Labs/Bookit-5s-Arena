import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ['192.168.101.106', '*.local', 'localhost'],
};

export default nextConfig;
