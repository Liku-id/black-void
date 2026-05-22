import { Suspense } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-0 pt-30 xl:pt-40">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </main>
  );
}
