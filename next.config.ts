import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./next-intl.config.ts');

const nextConfig: NextConfig = {
  // Skip TypeScript and ESLint checks during production build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '7099',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7099',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (process.env.WATCHPACK_POLLING || process.env.NEXT_WEBPACK_WATCH_OPTIONS_POLL) {
      config.watchOptions = {
        poll: parseInt(process.env.NEXT_WEBPACK_WATCH_OPTIONS_POLL || '1000'),
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    return config
  },
};

export default withNextIntl(nextConfig);
