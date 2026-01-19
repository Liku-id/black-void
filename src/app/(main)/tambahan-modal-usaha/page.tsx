'use client';

import React from 'react';
import HeroSection from '@/components/tambahan-modal-usaha/hero-section';
import CollaborationSection from '@/components/tambahan-modal-usaha/collaboration-section';
import WhyChooseSection from '@/components/tambahan-modal-usaha/why-choose-section';
import HowItWorksSection from '@/components/tambahan-modal-usaha/how-it-works-section';
import FundingRequirementsSection from '@/components/tambahan-modal-usaha/funding-requirements-section';
import FundingFormSection from '@/components/tambahan-modal-usaha/funding-form-section';
import EventTypesSection from '@/components/tambahan-modal-usaha/event-types-section';
import FAQSection from '@/components/home/faq-section';

export default function TambahanModalUsahaPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <HeroSection />
      <CollaborationSection />
      <EventTypesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <FundingRequirementsSection />
      <FundingFormSection />
      <FAQSection data={[]} />
    </main>
  );
}
