import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tailwind CSS v4 optimization
  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },

  // Image optimization
  images: {
    domains: [
      'dummyimage.com',
      'wukong-staging-public.s3.ap-southeast-3.amazonaws.com',
    ],
    // Modern formats for better compression (only affects raster images: PNG, JPG, etc.)
    // SVG files remain unchanged and are already optimized
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Security headers
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

  // Static optimization
  trailingSlash: false,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration for static export (if needed)
  // output: 'export', // Uncomment if you want static export

  // Base path (if deploying to subdirectory)
  // basePath: '',

  // Asset prefix (if using CDN)
  // assetPrefix: '',
};

export default nextConfig;
