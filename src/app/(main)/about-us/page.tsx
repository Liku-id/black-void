import { Metadata } from 'next';
import { SEO_CONFIG } from '@/config/seo';

export const metadata: Metadata = SEO_CONFIG.pages.aboutUs;
import HeroSection from '@/components/about-us/hero-section';
import WhoWeAreSection from '@/components/about-us/who-we-are-section';
import USPSection from '@/components/about-us/usp-section';
import FeaturesSection from '@/components/about-us/features-section';
import FinancialSection from '@/components/about-us/financial-section';
import CTASection from '@/components/about-us/cta-section';
import FAQSection from '@/components/home/faq-section';

const faqs = [
  {
    question: 'What Is Wukong as an All-in-One Ticketing & Event Management Platform?',
    answer:
      'Wukong is an all-in-one ticketing and event management platform designed to help event organizers manage ticket sales, attendee data, payments, and event operations in one integrated system. It supports events of various sizes with reliable performance and operational efficiency.',
  },
  {
    question: 'How Does the Online Ticketing System Support High-Traffic Events?',
    answer:
      'The online ticketing system is built to handle high transaction volumes and peak ticket sales periods. This ensures a smooth purchasing experience for attendees while maintaining system stability and data accuracy for organizers.',
  },
  {
    question: 'Is This Event Management Platform Suitable for Organizers Managing Multiple Events?',
    answer:
      'Yes. Wukong allows organizers to manage multiple events, ticket categories, and schedules from a single dashboard, making it easier to oversee operations and performance across different events.',
  },
  {
    question: 'How Does the Ticketing System Improve Event Operational Control?',
    answer:
      'The platform provides full visibility into ticket inventory, pricing, sales performance, and attendance data. This helps organizers maintain control, reduce operational risks, and make informed decisions throughout the event lifecycle.',
  },
  {
    question: 'How Does Fast & Secure Attendee Check-In Work at Events?',
    answer:
      'Wukong uses QR code–based check-in to enable fast, secure, and efficient attendee entry. This system reduces queues, prevents ticket duplication, and provides real-time attendance tracking during the event.',
  },
  {
    question: 'What Financial Reporting Features Are Available in the Ticketing Dashboard?',
    answer:
      'Organizers can access detailed financial reports including ticket sales summaries, revenue tracking, payout history, and transaction data. These reports support financial transparency and easier reconciliation.',
  },
  {
    question: 'What Is Special Leads Requirement in Event Ticketing?',
    answer:
      'Special Leads Requirement allows organizers to collect customized attendee information during ticket purchase. This supports targeted marketing, sponsor reporting, and better audience understanding.',
  },
  {
    question: 'How Does Group Ticketing Help Increase Ticket Sales?',
    answer:
      'Group Ticketing enables attendees to purchase multiple tickets in one transaction, often with special pricing. This feature encourages bulk purchases from communities, companies, or groups attending together.',
  },
  {
    question: 'What Are Private Link Tickets and When Should Organizers Use Them?',
    answer:
      'Private Link Tickets are exclusive ticket links shared with selected audiences. They are ideal for VIP guests, partners, internal teams, or invite-only events that require controlled access.',
  },
  {
    question: 'Which Payment Methods Are Supported by the Online Ticketing System?',
    answer:
      'The platform supports multiple secure payment gateways, allowing attendees to choose from various payment methods. This improves purchase convenience and increases conversion rates.',
  },
  {
    question: 'How Transparent Are the Fees for Event Organizers?',
    answer:
      'Wukong offers transparent and competitive pricing with no hidden costs. Organizers can clearly track fees and revenue through the financial dashboard.',
  },
  {
    question: 'How Does Flexible Withdrawal Support Event Financial Management?',
    answer:
      'Flexible withdrawal options allow organizers to manage revenue payouts based on event needs and timelines, helping maintain healthy cash flow before, during, and after the event.',
  },
  {
    question: 'Can Organizers Monitor Ticket Sales and Event Performance in Real Time?',
    answer:
      'Yes. The real-time dashboard provides up-to-date insights on ticket sales, attendance status, and revenue performance, enabling timely operational adjustments.',
  },
  {
    question: 'How Secure Is the Ticketing & Payment System?',
    answer:
      'The platform applies secure payment processing and data protection measures to ensure that all transactions and attendee information are handled safely and reliably.',
  },
  {
    question: 'How Quickly Can Organizers Set Up and Launch an Event?',
    answer:
      'Organizers can create, configure, and publish events in a short time using an intuitive onboarding flow—without requiring technical expertise.',
  },
  {
    question: 'What Types of Events Can Be Managed Using This Ticketing Platform?',
    answer:
      'Wukong supports concerts, festivals, conferences, exhibitions, community events, corporate gatherings, and private events, both offline and hybrid.',
  },
  {
    question: 'Is Customer Support Available for Event Organizers?',
    answer:
      'Yes. Event organizers have access to dedicated support to assist with setup, operations, and technical inquiries throughout the event process.',
  },
];

export default function AboutUsPage() {
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
