import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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