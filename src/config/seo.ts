import { Metadata } from 'next';

/**
 * Centralized SEO Configuration
 * Single source of truth untuk semua metadata di aplikasi
 */

export const SEO_CONFIG = {
  // Default config
  default: {
    siteName: 'Wukong',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://wukong.co.id',
  },

  // Static pages metadata
  pages: {
    home: {
      title: 'Official ticketing partner mudah dan terpercaya di Indonesia',
      description:
        'Buat event serumu sekarang gak perlu pusing karena semua lebih mudah di Wukong, platform official ticketing partner mudah dan terpercaya di Indonesia.',
      keywords:
        'ticket partner, ticketing partner, online ticketing partner, official ticketing partner, ticketing partner indonesia, platform jual tiket, jual tiket, tiket event, tiket konser, platform tiket online, jual tiket konser, jual tiket event, buat event seru',
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: 'Official ticketing partner mudah dan terpercaya di Indonesia',
        description:
          'Buat event serumu sekarang gak perlu pusing karena semua lebih mudah di Wukong, platform official ticketing partner mudah dan terpercaya di Indonesia.',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Official ticketing partner mudah dan terpercaya di Indonesia',
        description:
          'Buat event serumu sekarang gak perlu pusing karena semua lebih mudah di Wukong, platform official ticketing partner mudah dan terpercaya di Indonesia.',
      },
    } as Metadata,
    becomeCreator: {
      title:
        'Wukong official ticketing platform untuk semua Kreator konser dan juga event di Indonesia',
      description:
        'Wukong adalah platform official ticketing partner nomor satu dan terpercaya untuk semua event/konser kreator di Indonesia',
      keywords:
        'wukong event, event, tiket, beli tiket, tiket event, official ticketing partner, ticketing partner, ticketing',
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title:
          'Wukong official ticketing platform untuk semua Kreator konser dan juga event di Indonesia',
        description:
          'Wukong adalah platform official ticketing partner nomor satu dan terpercaya untuk semua event/konser kreator di Indonesia',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title:
          'Wukong official ticketing platform untuk semua Kreator konser dan juga event di Indonesia',
        description:
          'Wukong adalah platform official ticketing partner nomor satu dan terpercaya untuk semua event/konser kreator di Indonesia',
      },
    } as Metadata,
    eventFunding: {
      title: 'Secure Event Funding Platform for Concerts, Sports & Exhibitions | Wukong',
      description:
        'Wukong collaborates with EKUID helps professional event organizers access reliable event financing through securities crowdfunding scheme built for concerts, sports, exhibitions, and large-scale events.',
      keywords:
        'Event Funding Platform, Event Crowdfunding, Event Financing, Professional Event Organizers, securitites crowdfunding, crowdfunding, event funding, platform for event financing',
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: 'Secure Event Funding Platform for Concerts, Sports & Exhibitions | Wukong',
        description:
          'Wukong collaborates with EKUID helps professional event organizers access reliable event financing through securities crowdfunding scheme built for concerts, sports, exhibitions, and large-scale events.',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Secure Event Funding Platform for Concerts, Sports & Exhibitions | Wukong',
        description:
          'Wukong collaborates with EKUID helps professional event organizers access reliable event financing through securities crowdfunding scheme built for concerts, sports, exhibitions, and large-scale events.',
      },
    } as Metadata,
    aboutUs: {
      title: 'All-in-One Ticketing & Event Management Platform for Event Organizers | Wukong',
      description:
        'Manage ticket sales, attendee check-in, payments, and financial reports in one ticketing & event management platform. Built for scalable and reliable event operations.',
      keywords:
        'ticketing system, event management platform, online ticketing platform, event ticketing system, online ticketing system, event ticketing platform, ticket management system, event platform, event organizer platform',
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: 'All-in-One Ticketing & Event Management Platform for Event Organizers | Wukong',
        description:
          'Manage ticket sales, attendee check-in, payments, and financial reports in one ticketing & event management platform. Built for scalable and reliable event operations.',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'All-in-One Ticketing & Event Management Platform for Event Organizers | Wukong',
        description:
          'Manage ticket sales, attendee check-in, payments, and financial reports in one ticketing & event management platform. Built for scalable and reliable event operations.',
      },
    } as Metadata,
  },

  // Dynamic event_detail untuk generate metadata
  event_detail: {
    event: {
      title: (eventName: string) => `Wukong event - ${eventName}`,
      description: (eventName: string) =>
        `${eventName} - Wukong tempat beli semua jenis tiket dari tiket event dan tiket konser kesayangan kamu`,
      keywords: (eventName: string) =>
        `wukong event, event, tiket, beli tiket, tiket event, ${eventName}`,
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
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: SEO_CONFIG.event_detail.event.title(eventName),
      description: SEO_CONFIG.event_detail.event.description(eventName),
      url: `${SEO_CONFIG.default.baseUrl}/event/${eventName.toLowerCase().replace(/\s+/g, '-')}`,
      siteName: SEO_CONFIG.default.siteName,
      type: 'website',
    },
  };
}
