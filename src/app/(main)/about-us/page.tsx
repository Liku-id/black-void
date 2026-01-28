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
    question: 'What Is Event Funding Platform by Wukong x EKUID ?',
    answer:
      'Wukong collaborated with EKUID to provide next-generation event funding platform that helps professional event organizers secure capital through structured event crowdfunding and event financing. We enable organizers to fund, manage, and scale events with confidence—from planning to execution.',
  },
  {
    question: 'Who Is Eligible for held Funding on Wukong X EKUID?',
    answer: (
      <>
        Wukong X EKUID provide event funding designed for{' '}
        <strong>
          professional event organizers, production houses, and non-public
          companies
        </strong>{' '}
        planning commercial or large-scale events. Each application is reviewed
        to ensure quality, feasibility, and sustainability.
      </>
    ),
  },
  {
    question: 'How Does Event Crowdfunding Work on Wukong?',
    answer: (
      <>
        Our <strong>event crowdfunding system</strong> allows organizers to raise
        funds after passing verification and due diligence. Funding is collected
        transparently and released in stages based on approved milestones—keeping
        your event financially healthy and trusted by contributors.
      </>
    ),
  },
  {
    question: 'What Types of Events Can Use Wukong Event Funding?',
    answer: (
      <>
        Wukong supports a wide range of event categories, including:
        <ul className="list-disc pl-5 mt-2">
          <li>Music & Entertainment Events</li>
          <li>Sports & Running Events</li>
          <li>Conferences & Exhibitions</li>
          <li>Community & Creative Events</li>
        </ul>
        <br />
        Each event funding proposal is evaluated based on scale, audience demand,
        and execution readiness.
      </>
    ),
  },
  {
    question: 'How Much Capital Can I Raise Through Event Funding?',
    answer: (
      <>
        Wukong provides{' '}
        <strong>event financing up to IDR 10 billion</strong>, depending on
        your event profile, funding structure, and due diligence results. This
        makes Wukong ideal for both growing and large-scale events.
      </>
    ),
  },
  {
    question: 'Why Choose Event Financing Instead of Traditional Loans?',
    answer: (
      <>
        Unlike traditional loans,{' '}
        <strong>event financing on Wukong X EKUID</strong> reduces upfront
        financial pressure, improves cash flow, and aligns funding with real
        event performance—allowing organizers to focus on delivering great
        experiences.
      </>
    ),
  },
  {
    question: 'Is Wukong Event Funding Safe and Regulated?',
    answer:
      'Yes. Wukong operates as a licensed and secure event funding platform, applying strict compliance, fund control mechanisms, and transparent reporting to protect both organizers and contributors.',
  },
  {
    question: 'How Long Does the Event Funding Approval Process Take?',
    answer: (
      <>
        According to OJK regulations,{' '}
        <strong>
          crowdfunding campaigns are conducted within 45 days
        </strong>
        , excluding registration, due diligence, and Etc. However, It is
        possible that the process could be faster, depending on how attractive
        the campaign is to investors.
      </>
    ),
  },
  {
    question: 'How Are Event Funds Disbursed to Organizers?',
    answer:
      'Event funds are disbursed gradually based on the approved funding plan and event milestones—ensuring responsible use of capital and smoother event execution.',
  },
  {
    question: 'Can Event Ticket Sales Be Integrated with Event Funding?',
    answer:
      'Yes. Wukong integrates event ticket sales with funding and reporting, giving organizers real-time insights into ticket performance, funding progress, and overall event financial health.',
  },
  {
    question: 'What Happens If an Event Is Cancelled or Rescheduled?',
    answer:
      'In case of cancellation or rescheduling, Wukong applies predefined event funding risk management and refund mechanisms to ensure fair outcomes for all parties.',
  },
  {
    question: 'Do I Need Prior Experience to Apply for Event Funding?',
    answer: (
      <>
        Experience helps, but it’s not mandatory. Wukong evaluates{' '}
        <strong>event funding applications</strong> based on planning quality,
        team credibility, market demand, and financial feasibility.
      </>
    ),
  },
  {
    question: 'What Documents Are Required for Event Funding Application?',
    answer: (
      <>
        Typical requirements include:
        <ul className="list-disc pl-5 mt-2">
          <li>Company profile</li>
          <li>Event proposal & budget plan</li>
          <li>Legal and business documents</li>
          <li>Supporting materials relevant to the event</li>
        </ul>
        <br />
        These help us structure the right event funding solution for you.
      </>
    ),
  },
  {
    question: 'How Do I Start Event Funding on Wukong?',
    answer: (
      <>
        Simply click <strong>“Start Funding”</strong>, submit your event and
        company details, and our team will guide you through the verification
        and funding process.
      </>
    ),
  },
  {
    question: 'How Can I Contact Wukong for Event Funding Support?',
    answer:
      'Our team is ready to help. Reach out via the contact form or official channels listed on the website for fast, professional support.',
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
