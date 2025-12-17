import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/config/seo';

/**
 * Generate robots.txt untuk SEO
 * Mengarahkan search engine ke sitemap
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.default.baseUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/ticket/',
          '/transaction/',
          '/login',
          '/register',
          '/reset-password',
          '/forgot-password',
          '/change-password',
          '/tickets', // Protected route
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
