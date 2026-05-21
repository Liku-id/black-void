import { Metadata } from 'next';
import { SEO_CONFIG } from '@/config/seo';
import HeroSection from '@/components/event-funding/hero-section';
import CollaborationSection from '@/components/event-funding/collaboration-section';
import WhyChooseSection from '@/components/event-funding/why-choose-section';
import HowItWorksSection from '@/components/event-funding/how-it-works-section';
import FundingRequirementsSection from '@/components/event-funding/funding-requirements-section';
import FundingFormSection from '@/components/event-funding/funding-form-section';
import EventTypesSection from '@/components/event-funding/event-types-section';
import FAQSection from '@/components/home/faq-section';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = SEO_CONFIG.pages.eventFunding;

export default function EventFundingPage() {
  const t = useTranslations('eventFunding.faq');
  const faqs = [
    {
      question: t('items.1.title'),
      answer: t('items.1.desc'),
    },
    {
      question: t('items.2.title'),
      answer: t.rich('items.2.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.3.title'),
      answer: t.rich('items.3.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.4.title'),
      answer: t.rich('items.4.desc', {
        span: (chunks) => <span>{chunks}</span>,
        ul: (chunks) => <ul className="list-disc pl-5 my-2">{chunks}</ul>,
        li: (chunks) => <li>{chunks}</li>,
      }),
    },
    {
      question: t('items.5.title'),
      answer: t.rich('items.5.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.6.title'),
      answer: t.rich('items.6.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.7.title'),
      answer: t('items.7.desc'),
    },
    {
      question: t('items.8.title'),
      answer: t.rich('items.8.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.9.title'),
      answer: t('items.9.desc'),
    },
    {
      question: t('items.10.title'),
      answer: t('items.10.desc'),
    },
    {
      question: t('items.11.title'),
      answer: t('items.11.desc'),
    },
    {
      question: t('items.12.title'),
      answer: t.rich('items.12.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.13.title'),
      answer: t.rich('items.13.desc', {
        span: (chunks) => <span>{chunks}</span>,
        ul: (chunks) => <ul className="list-disc pl-5 my-2">{chunks}</ul>,
        li: (chunks) => <li>{chunks}</li>,
      }),
    },
    {
      question: t('items.14.title'),
      answer: t.rich('items.14.desc', {
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b className="font-bold">{chunks}</b>,
      }),
    },
    {
      question: t('items.15.title'),
      answer: t('items.15.desc'),
    },
  ];

  return (
    <main className="bg-black text-white min-h-screen">
      <HeroSection />
      <CollaborationSection />
      <EventTypesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <FundingRequirementsSection />
      <FundingFormSection />
      <FAQSection data={faqs} />
    </main>
  );
}
