import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.levate-bootcamp.cloud',
        pathname: '/storage/entities/diploma/**',
      },
    ],
  },
  transpilePackages: ['react-hot-toast'],
};

export default nextConfig;