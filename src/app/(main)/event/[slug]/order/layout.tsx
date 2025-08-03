import OrderHeader from '@/components/layout/header/order';
import { Suspense } from 'react';

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Suspense>
        <OrderHeader />
        {children}
      </Suspense>
    </main>
  );
}
