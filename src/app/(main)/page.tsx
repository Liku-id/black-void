import CarouselSection from '@/components/home/carousel-section';
import EventListSection from '@/components/home/event-list-section';
import CreatorListSection from '@/components/home/creator-list-section';
import FAQSection from '@/components/home/faq-section';
import { SEO_CONFIG } from '@/config/seo';

export const metadata = SEO_CONFIG.pages.home;

export default function Home() {
  return (
    <main>
      <CarouselSection />
      <EventListSection />
      <CreatorListSection />
      <FAQSection />
    </main>
  );
}
