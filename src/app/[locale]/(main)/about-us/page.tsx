import { createLocalizedMetadata } from '@/config/seo';

export const generateMetadata = createLocalizedMetadata('aboutUs', 'metadata.about_us');
import HeroSection from '@/components/about-us/hero-section';
import WhoWeAreSection from '@/components/about-us/who-we-are-section';
import USPSection from '@/components/about-us/usp-section';
import FeaturesSection from '@/components/about-us/features-section';
import FinancialSection from '@/components/about-us/financial-section';
import CTASection from '@/components/about-us/cta-section';
import FAQSection from '@/components/home/faq-section';
import { getTranslations } from 'next-intl/server';

export default async function AboutUsPage() {
  const t = await getTranslations('aboutUs.faq');

  const faqs = [
    {
      question: t('items.1.title'),
      answer: t('items.1.desc')
    },
    {
      question: t('items.2.title'),
      answer: t('items.2.desc')
    },
    {
      question: t('items.3.title'),
      answer: t('items.3.desc')
    },
    {
      question: t('items.4.title'),
      answer: t('items.4.desc')
    },
    {
      question: t('items.5.title'),
      answer: t('items.5.desc')
    },
    {
      question: t('items.6.title'),
      answer: t('items.6.desc')
    },
    {
      question: t('items.7.title'),
      answer: t('items.7.desc')
    },
    {
      question: t('items.8.title'),
      answer: t('items.8.desc')
    },
    {
      question: t('items.9.title'),
      answer: t('items.9.desc')
    },
    {
      question: t('items.10.title'),
      answer: t('items.10.desc')
    },
    {
      question: t('items.11.title'),
      answer: t('items.11.desc')
    },
    {
      question: t('items.12.title'),
      answer: t('items.12.desc')
    },
    {
      question: t('items.13.title'),
      answer: t('items.13.desc')
    },
    {
      question: t('items.14.title'),
      answer: t('items.14.desc')
    },
    {
      question: t('items.15.title'),
      answer: t('items.15.desc')
    },
    {
      question: t('items.16.title'),
      answer: t('items.16.desc')
    },
    {
      question: t('items.17.title'),
      answer: t('items.17.desc')
    },
  ];

  return (
    <main className="bg-black text-white min-h-screen">
      <HeroSection />
      <WhoWeAreSection />
      <USPSection />
      <FeaturesSection />
      <FinancialSection />
      <CTASection />
      <FAQSection data={faqs} />
    </main>
  );
}
