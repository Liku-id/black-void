import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Suspense } from 'react';

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-0 pt-30 xl:pt-40">
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </main>
  );
}
