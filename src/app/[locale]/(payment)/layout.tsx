import OrderHeader from '@/components/layout/header/order';
import { Suspense } from 'react';
import { Box } from '@/components';

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-0 pt-30 lg:pt-40">
      <Suspense>
        <OrderHeader />
      </Suspense>
      <Box className="mt-13">
        {children}
      </Box>
    </main>
  );
}
