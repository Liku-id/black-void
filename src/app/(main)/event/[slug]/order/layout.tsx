import OrderHeader from '@/components/layout/header/order';
import { Suspense } from 'react';

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <OrderHeader />
      {children}
    </Suspense>
  );
}
