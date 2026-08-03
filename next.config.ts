import type { NextConfig } from 'next';
import packageJson from './package.json';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Tailwind CSS v4 optimization
  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.ap-southeast-3.amazonaws.com',
        pathname: '/**',
      },
      // GCS (GEN-3947). Assets arrive as V4 signed URLs, so the query string
      // carries a signature that changes on every API response. The path is
      // pinned to our buckets: the host alone would turn /_next/image into an
      // optimizer for every public bucket on GCS.
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/wukong-*/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Matches the signed URL lifetime: a new signature is a new cache key, so
    // entries are never hit twice and a 30-day TTL only grows the image cache
    // on disk. Raise this again once assets get permanent URLs.
    minimumCacheTTL: 900,
  },

  // Security headers
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Compression and optimization
  output: 'standalone',

  // Redirects for legacy routes (e.g. from existing emails)
  async redirects() {
    return [
      {
        source: '/transaction/:id/status',
        destination: '/payment-success/:id',
        permanent: true,
      },
      {
        source: '/transaction/:id',
        destination: '/checkout-payment/:id',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION:
      process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version,
  },
};

export default withNextIntl(nextConfig);
