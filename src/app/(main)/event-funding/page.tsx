import React from 'react';
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

const faqs = [
  {
    question: 'What Is Event Funding Platform by Wukong x EKUID ?',
    answer: 'Wukong collaborated with EKUID to provide next-generation event funding platform that helps professional event organizers secure capital through structured event crowdfunding and event financing. We enable organizers to fund, manage, and scale events with confidence—from planning to execution.',
  },
  {
    question: 'Who Can Apply for Wukong Event Funding?',
    answer: (
      <span>
        Wukong X EKUID provide event funding designed for <b>professional event organizers, production houses, and non-public companies</b> planning commercial or large-scale events. Each application is reviewed to ensure quality, feasibility, and sustainability.
      </span>
    ),
  },
  {
    question: 'How Does Event Crowdfunding Work on Wukong?',
    answer: (
      <span>
        Our <b>event crowdfunding system</b> allows organizers to raise funds after passing verification and due diligence. Funding is collected transparently and released in stages based on approved milestones—keeping your event financially healthy and trusted by contributors.
      </span>
    ),
  },
  {
    question: 'What Types of Events Can Use Wukong Event Funding?',
    answer: (
      <span>
        Wukong supports a wide range of event categories, including:
        <ul className="list-disc pl-5 my-2">
          <li>Music & Entertainment Events</li>
          <li>Sports & Running Events</li>
          <li>Conferences & Exhibitions</li>
          <li>Community & Creative Events</li>
        </ul>
        Each event funding proposal is evaluated based on scale, audience demand, and execution readiness.
      </span>
    ),
  },
  {
    question: 'How Much Capital Can I Raise Through Event Funding?',
    answer: (
      <span>
        Wukong provides <b>event financing up to IDR 10 billion</b>, depending on your event profile, funding structure, and due diligence results. This makes Wukong ideal for both growing and large-scale events.
      </span>
    ),
  },
  {
    question: 'Why Choose Event Financing Instead of Traditional Loans?',
    answer: (
      <span>
        Unlike traditional loans, <b>event financing on Wukong X EKUID</b> reduces upfront financial pressure, improves cash flow, and aligns funding with real event performance—allowing organizers to focus on delivering great experiences.
      </span>
    ),
  },
  {
    question: 'Is Wukong Event Funding Safe and Regulated?',
    answer: 'Yes. Wukong operates as a licensed and secure event funding platform, applying strict compliance, fund control mechanisms, and transparent reporting to protect both organizers and contributors.',
  },
  {
    question: 'How Long Does the Event Funding Approval Process Take?',
    answer: (
      <span>
        According to OJK regulations, <b>crowdfunding campaigns are conducted within 45 days</b>, excluding registration, due diligence, and Etc. However, it is possible that the process could be faster, depending on how attractive the campaign is to investors.
      </span>
    ),
  },
  {
    question: 'How Are Event Funds Disbursed to Organizers?',
    answer: 'Event funds are disbursed gradually based on the approved funding plan and event milestones—ensuring responsible use of capital and smoother event execution.',
  },
  {
    question: 'Can Event Ticket Sales Be Integrated with Event Funding?',
    answer: 'Yes. Wukong integrates event ticket sales with funding and reporting, giving organizers real-time insights into ticket performance, funding progress, and overall event financial health.',
  },
  {
    question: 'What Happens If an Event Is Cancelled or Rescheduled?',
    answer: 'In case of cancellation or rescheduling, Wukong applies predefined event funding risk management and refund mechanisms to ensure fair outcomes for all parties.',
  },
  {
    question: 'Do I Need Prior Experience to Apply for Event Funding?',
    answer: (
      <span>
        Experience helps, but it’s not mandatory. Wukong evaluates <b>event funding applications</b> based on planning quality, team credibility, market demand, and financial feasibility.
      </span>
    ),
  },
  {
    question: 'What Documents Are Required for Event Funding Application?',
    answer: (
      <span>
        Typical requirements include:
        <ul className="list-disc pl-5 my-2">
          <li>Company profile</li>
          <li>Event proposal & budget plan</li>
          <li>Legal and business documents</li>
          <li>Supporting materials relevant to the event</li>
        </ul>
        These help us structure the right event funding solution for you.
      </span>
    ),
  },
  {
    question: 'How Do I Start Event Funding on Wukong?',
    answer: (
      <span>
        Simply click <b>“Start Funding”</b>, submit your event and company details, and our team will guide you through the verification and funding process.
      </span>
    ),
  },
  {
    question: 'How Can I Contact Wukong for Event Funding Support?',
    answer: 'Our team is ready to help. Reach out via the contact form or official channels listed on the website for fast, professional support.',
  },
];

export const metadata: Metadata = SEO_CONFIG.pages.eventFunding;

export default function EventFundingPage() {
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
