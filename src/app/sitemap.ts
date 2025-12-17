import { MetadataRoute } from 'next';
import axios from '@/lib/api/axios-server';
import { SEO_CONFIG } from '@/config/seo';

/**
 * Generate sitemap.xml
 * Server Side
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.default.baseUrl;
  const currentDate = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/become-creator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/term-and-condition`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Fetch event pages for seo
  let eventPages: MetadataRoute.Sitemap = [];

  try {
    const res = await axios.get(
      '/v1/events?status=EVENT_STATUS_ON_GOING&status=EVENT_STATUS_APPROVED&status=EVENT_STATUS_DONE&limit=1000&page=0'
    );
    const data = res.data;

    if (res.status === 200 && data.statusCode === 0 && data.body && Array.isArray(data.body.data)) {
      eventPages = data.body.data
        .filter((event: any) => {
          return event.metaUrl;
        })
        .map((event: any) => ({
          url: `${baseUrl}/event/${event.metaUrl}`,
          lastModified: event.updatedAt || event.createdAt || currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        }));
    }
  } catch {
    // silent response
  }

  return [...staticPages, ...eventPages];
}
