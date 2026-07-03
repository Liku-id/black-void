'use client';
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useCountdown } from '@/utils/timer';
import { useParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { resetOrderBookingAtom } from '@/store';
import { Box, Container } from '@/components';
import Loading from '@/components/layout/loading';
import axiosClient from '@/lib/api/axios-client';
import { getErrorMessage } from '@/lib/api/error-handler';

const VAComponent = dynamic(() => import('./va'));
const QRISComponent = dynamic(() => import('./qris'));

export default function PaymentConfirmation() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id;
  const t = useTranslations('payment');

  const { data, isLoading, error, mutate } = useSWR(
    transactionId ? `/api/transaction/${transactionId}` : null
  );

  const errorMessage = error ? getErrorMessage(error) : '';

  // Countdown logic
  // const expiredAtStr = data && data.transaction && data.transaction.expiresAt;
  // const expiredAt = expiredAtStr && new Date(expiredAtStr);
  // const now = new Date();
  const [initialSeconds, setInitialSeconds] = useState(900);
  const [secondsLeft, resetCountdown] = useCountdown(initialSeconds);
  const [, resetOrder] = useAtom(resetOrderBookingAtom);
  const hasCalledInvalidate = useRef(false);

  useEffect(() => {
    resetOrder();

    if (data && data.transaction && data.transaction.status !== 'pending') {
      router.push(`/payment-success/${transactionId}`);
    }
  }, [data, router, resetOrder, transactionId]);

  useEffect(() => {
    if (data && data.transaction && data.transaction.expiresAt) {
      const expiredAt = new Date(data.transaction.expiresAt);
      const now = new Date();
      setInitialSeconds(
        Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / 1000))
      );
      resetCountdown();
    }
  }, [data, resetCountdown]);

  // Call invalidate API when countdown reaches 0
  useEffect(() => {
    const invalidateExpiredTransaction = async () => {
      try {
        await axiosClient.post('/api/order/invalidate-expired-transaction');
        mutate();
      } catch (error) {
        console.error('Failed to invalidate expired transaction:', error);
      }
    };

    if (secondsLeft === 0 && !hasCalledInvalidate.current) {
      hasCalledInvalidate.current = true;
      invalidateExpiredTransaction();
    }
  }, [secondsLeft]);

  // Redirect logic for payment_link
  useEffect(() => {
    if (
      data &&
      data.transaction &&
      data.transaction.paymentDetails &&
      data.transaction.paymentDetails.paymentLink
    ) {
      const url = data.transaction.paymentDetails.paymentLink.paymentLinkUrl;
      if (url && data.transaction.status === 'pending') {
        window.location.href = url;
      }
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (!isLoading && !data)
    return (
      <Container>
        <Box className="text-muted flex h-[200px] items-center justify-center">
          No data
        </Box>
      </Container>
    );

  if (
    data &&
    data.transaction &&
    data.transaction.paymentDetails &&
    data.transaction.paymentDetails.paymentLink
  ) {
    return (
      <Container>
        <Box className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
          <Loading isFullPage={false} />
          <h2 className="text-xl font-semibold text-white">
            {t('redirecting')}
          </h2>
          <p className="text-muted text-sm">
            {t('no_refresh')}
          </p>
        </Box>
      </Container>
    );
  }

  if (data && data.transaction && data.transaction.paymentDetails.va) {
    return (
      <VAComponent data={data} mutate={mutate} secondsLeft={secondsLeft} error={errorMessage} />
    );
  }

  if (data && data.transaction && data.transaction.paymentDetails.qris) {
    return (
      <QRISComponent data={data} mutate={mutate} secondsLeft={secondsLeft} error={errorMessage} />
    );
  }

  return '';
}
