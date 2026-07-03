'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Loading from '@/components/layout/loading';
import { Box, Container } from '@/components';

export default function OrderLandingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  const t = useTranslations('payment');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Retrieve transactionId from localStorage to bypass potential gateway schema limitations on Order object
  useEffect(() => {
    if (orderId) {
      const txId = localStorage.getItem(`tx_order_${orderId}`);
      if (txId) {
        setTransactionId(txId);
      }
    }
  }, [orderId]);

  // Poll transaction details directly if we have the transaction ID
  const { data: txData, error: txError } = useSWR<any>(
    transactionId ? `/api/transaction/${transactionId}` : null,
    { refreshInterval: 2000 }
  );

  // Fallback: Poll order details if transaction ID is not available in localStorage
  const { data: orderData, error: orderError } = useSWR<any>(
    !transactionId && orderId ? `/api/order/${orderId}` : null,
    { refreshInterval: 2000 }
  );

  // Combined handler for payment status change (checking both primary transaction polling and fallback order polling)
  useEffect(() => {
    // Primary path: check transaction data first
    if (txData && txData.transaction) {
      if (txData.transaction.status === 'paid') {
        if (orderId) localStorage.removeItem(`tx_order_${orderId}`);
        router.replace(`/payment-success/${txData.transaction.id}`);
      } else if (txData.transaction.status === 'failed') {
        if (orderId) localStorage.removeItem(`tx_order_${orderId}`);
        router.replace('/');
      }
      return;
    }

    // Fallback path: check order data if transaction data is not yet resolved
    if (orderData) {
      if (orderData.status === 'paid' && orderData.transactionId) {
        router.replace(`/payment-success/${orderData.transactionId}`);
      } else if (orderData.status === 'failed') {
        router.replace('/');
      }
    }
  }, [txData, orderData, orderId, router]);

  const error = txError || orderError;

  if (error) {
    return (
      <Container>
        <Box className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
          <h2 className="text-xl font-semibold text-red-500">
            {t('failed_title')}
          </h2>
          <p className="text-muted text-sm">{t('failed_desc')}</p>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <Loading isFullPage={false} />
        <h2 className="text-xl font-semibold text-white">{t('verifying')}</h2>
        <p className="text-muted text-sm">{t('confirming')}</p>
      </Box>
    </Container>
  );
}
