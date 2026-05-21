import dynamic from 'next/dynamic';
import CarouselSection from '@/components/home/carousel-section';
import { SEO_CONFIG } from '@/config/seo';
import { getCarouselData } from '@/components/home/carousel-section/carousel.data';
import { getTranslations } from 'next-intl/server';

const HomeEventListSection = dynamic(
  () => import('@/components/home/event-list-section')
);
const HomeCreatorListSection = dynamic(
  () => import('@/components/home/creator-list-section')
);
const HomeFAQSection = dynamic(() => import('@/components/home/faq-section'));

export const metadata = SEO_CONFIG.pages.home;

export default async function Home() {
  const t = await getTranslations();
  const carouselItems = await getCarouselData();
  const faqs = [
    {
      question: t('faq.buy_ticket_q'),
      answer: t('faq.buy_ticket_a'),
    },
    {
      question: t('faq.payment_methods_q'),
      answer: t('faq.payment_methods_a'),
    },
    {
      question: t('faq.find_ticket_q'),
      answer: t('faq.find_ticket_a'),
    },
    {
      question: t('faq.print_ticket_q'),
      answer: t('faq.print_ticket_a'),
    },
    {
      question: t('faq.refund_q'),
      answer: t('faq.refund_a'),
    },
    {
      question: t('faq.no_email_q'),
      answer: t('faq.no_email_a'),
    },
    {
      question: t('faq.event_canceled_q'),
      answer: t('faq.event_canceled_a'),
    },
    {
      question: t('faq.multiple_tickets_q'),
      answer: t('faq.multiple_tickets_a'),
    },
    {
      question: t('faq.safety_q'),
      answer: t('faq.safety_a'),
    },
    {
      question: t('faq.contact_support_q'),
      answer: t('faq.contact_support_a'),
    },
  ];

  return (
    <main>
      <CarouselSection items={carouselItems} />
      <HomeEventListSection />
      <HomeCreatorListSection />
      <HomeFAQSection data={faqs} />
    </main>
  );
}
