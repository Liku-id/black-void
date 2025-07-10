'use client';

import CarouselSection from '@/components/home/carousel-section';
import ProjectListSection from '@/components/home/project-list-section';
import CreatorListSection from '@/components/home/creator-list-section';
import FAQSection from '@/components/home/faq-section';
import { Footer, Header } from '@/components';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-36 xl:pt-40 px-0">
        <CarouselSection />
        <ProjectListSection />
        <CreatorListSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
