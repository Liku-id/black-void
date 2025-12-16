import { MetadataRoute } from 'next';
import axios from '@/lib/api/axios-server';
import { SEO_CONFIG } from '@/config/seo';

/**
 * Generate sitemap.xml untuk SEO
 * Mengikuti pattern yang sama dengan API routes di codebase
 * Mencakup halaman statis dan halaman event dinamis
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.default.baseUrl;
  const currentDate = new Date().toISOString();

  // Halaman statis dengan prioritas dan frekuensi update
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

  // Fetch event pages dinamis - mengikuti pattern dari /api/events/route.ts
  let eventPages: MetadataRoute.Sitemap = [];

  try {
    const res = await axios.get(
      '/v1/events?status=EVENT_STATUS_ON_GOING&status=EVENT_STATUS_APPROVED&status=EVENT_STATUS_DONE&limit=1000&page=0'
    );
    const data = res.data;

    // Validasi response mengikuti pattern yang sama dengan API route
    if (res.status !== 200) {
      console.error('Error fetching events for sitemap: Invalid status', res.status);
    } else if (data.statusCode !== 0 || !data.body) {
      console.error('Error fetching events for sitemap: Invalid response format');
    } else if (Array.isArray(data.body.data)) {
      // Map events ke sitemap entries
      eventPages = data.body.data
        .filter((event: any) => {
          // Hanya include event yang memiliki metaUrl
          return event.metaUrl;
        })
        .map((event: any) => ({
          url: `${baseUrl}/event/${event.metaUrl}`,
          lastModified: event.updatedAt || event.createdAt || currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        }));
    }
  } catch (error: any) {
    // Jika gagal fetch events, tetap return static pages
    // Error handling mengikuti pattern yang sama dengan API routes
    console.error('Error fetching events for sitemap:', error?.message || error);
  }

  // Gabungkan static pages dan event pages
  return [...staticPages, ...eventPages];
}
