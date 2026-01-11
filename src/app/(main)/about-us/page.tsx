'use client';

import React from 'react';
import HeroSection from '@/components/about-us/hero-section';
import WhoWeAreSection from '@/components/about-us/who-we-are-section';
import USPSection from '@/components/about-us/usp-section';
import FeaturesSection from '@/components/about-us/features-section';
import FinancialSection from '@/components/about-us/financial-section';
import CTASection from '@/components/about-us/cta-section';
import FAQSection from '@/components/home/faq-section';

export default function AboutUsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <HeroSection />
      <WhoWeAreSection />
      <USPSection />
      <FeaturesSection />
      <FinancialSection />
      <CTASection />
      <FAQSection />
    </main>
  );
}
