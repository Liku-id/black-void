import { Metadata } from 'next';

/**
 * Centralized SEO Configuration
 * Single source of truth untuk semua metadata di aplikasi
 */

export const SEO_CONFIG = {
  // Default config
  default: {
    siteName: 'Wukong',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://wukong.id',
  },

  // Static pages metadata
  pages: {
    home: {
      title:
        'Wukong - Official ticketing partner mudah dan terpercaya di Indonesia',
      description:
        'Buat event serumu sekarang gak perlu pusing karena semua lebih mudah di Wukong, platform official ticketing partner mudah dan terpercaya di Indonesia.',
      keywords:
        'ticket partner, ticketing partner, online ticketing partner, official ticketing partner, ticketing partner indonesia, platform jual tiket, jual tiket, tiket event, tiket konser, platform tiket online, jual tiket konser, jual tiket event, buat event seru',
    } as Metadata,
  },

  // Dynamic event_detail untuk generate metadata
  event_detail: {
    event: {
      title: (eventName: string) => `Wukong event - ${eventName}`,
      description: (eventName: string) =>
        `${eventName} - Wukong tempat beli semua jenis tiket dari tiket event dan tiket konser kesayangan kamu`,
      keywords: (eventName: string) =>
        `wukong event, event, tiket, beli tikit, tiket event, ${eventName}`,
    },
  },

  // Fallback metadata
  fallback: {
    event: {
      title: 'Wukong event - Event Not Found',
      description:
        'Wukong tempat beli semua jenis tiket dari tiket event dan tiket konser kesayangan kamu',
      keywords: 'wukong event, event, tiket, beli tiket, tiket event',
    } as Metadata,
  },
};

/**
 * Helper function untuk generate dynamic metadata
 */
export function generateEventMetadata(eventName?: string): Metadata {
  if (!eventName) {
    return SEO_CONFIG.fallback.event;
  }

  return {
    title: SEO_CONFIG.event_detail.event.title(eventName),
    description: SEO_CONFIG.event_detail.event.description(eventName),
    keywords: SEO_CONFIG.event_detail.event.keywords(eventName),
  };
}
