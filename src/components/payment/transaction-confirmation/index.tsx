'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useCountdown } from '@/utils/timer';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import { resetOrderBookingAtom } from '@/store';
import { Box, Container } from '@/components';
import Loading from '@/components/layout/loading';

const VAComponent = dynamic(() => import('./va'));
const QRISComponent = dynamic(() => import('./qris'));

export default function PaymentConfirmation({
  transactionId,
}: {
  transactionId: string;
}) {
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(
    transactionId ? `/api/transaction/${transactionId}` : null
  );

  // Countdown logic
  // const expiredAtStr = data && data.transaction && data.transaction.expiresAt;
  // const expiredAt = expiredAtStr && new Date(expiredAtStr);
  // const now = new Date();
  const [initialSeconds, setInitialSeconds] = useState(900);
  const [secondsLeft, resetCountdown] = useCountdown(initialSeconds);
  console.log('secondsLeft', secondsLeft);
  const [, resetOrder] = useAtom(resetOrderBookingAtom);

  useEffect(() => {
    resetOrder();

    if (data && data.transaction && data.transaction.status !== 'pending') {
      router.push(`/transaction/${transactionId}/status`);
    }
  }, [data, router, resetOrder, transactionId]);

  useEffect(() => {
      if (data && data.transaction && data.transaction.expiresAt) {
        const expiredAt = new Date(data.transaction.expiresAt);
        const now = new Date();
        setInitialSeconds(Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / 1000)));
        console.log('Initial seconds set to:', initialSeconds);
        resetCountdown();
      }
    }, [data, resetCountdown]);

  if (isLoading) return <Loading />;
  if (!isLoading && !data)
    return (
      <Container>
        <Box className="text-muted flex h-[200px] items-center justify-center">
          No data
        </Box>
      </Container>
    );

  if (data && data.transaction && data.transaction.paymentDetails.va) {
    return (
      <VAComponent data={data} mutate={mutate} secondsLeft={secondsLeft} />
    );
  }

  if (data && data.transaction && data.transaction.paymentDetails.qris) {
    return (
      <QRISComponent data={data} mutate={mutate} secondsLeft={secondsLeft} />
    );
  }

  return '';
}
