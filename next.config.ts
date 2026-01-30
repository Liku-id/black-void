import type { NextConfig } from 'next';
import packageJson from './package.json';

const nextConfig: NextConfig = {
  // Tailwind CSS v4 optimization
  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },

  // Image optimization
  images: {
    domains: [
      'wukong-staging-public.s3.ap-southeast-3.amazonaws.com',
      'wukong-staging-private.s3.ap-southeast-3.amazonaws.com',
      'dummyimage.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wukong-staging-public.s3.ap-southeast-3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wukong-staging-private.s3.ap-southeast-3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.ap-southeast-3.amazonaws.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
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
  compress: true,
  output: 'standalone',

  // Static optimization
  trailingSlash: false,

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  // PostHog reverse proxy rewrites for improved tracking reliability
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    // Otomatis mengambil versi dari package.json
    // Bisa di-override dengan NEXT_PUBLIC_APP_VERSION di .env jika diperlukan
    NEXT_PUBLIC_APP_VERSION:
      process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version,
  },

  // Output configuration for static export (if needed)
  // output: 'export', // Uncomment if you want static export

  // Base path (if deploying to subdirectory)
  // basePath: '',

  // Asset prefix (if using CDN)
  // assetPrefix: '',
};

export default nextConfig;
