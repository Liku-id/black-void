import OrderHeader from '@/components/layout/header/order';
import { Suspense } from 'react';

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-0 pt-35 lg:pt-40">
      <Suspense>
        <OrderHeader />
      </Suspense>
      {children}
    </main>
  );
}
