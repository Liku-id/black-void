import CarouselSection from '@/components/home/carousel-section';
import ProjectListSection from '@/components/home/project-list-section';
import CreatorListSection from '@/components/home/creator-list-section';
import FAQSection from '@/components/home/faq-section';

export default function Home() {
  return (
    <main>
      <CarouselSection />
      <ProjectListSection />
      <CreatorListSection />
      <FAQSection />
    </main>
  );
}
