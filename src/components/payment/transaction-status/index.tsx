'use client';
import React, { useEffect } from 'react';
import { Typography, Container, Box, Button } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import { formatDate, formatRupiah } from '@/utils/formatter';
import Image from 'next/image';
import successStatus from '@/assets/icons/success-status.svg';
import failedStatus from '@/assets/icons/failed-status.svg';
import dashedDivider from '@/assets/images/dashed-divider.svg';
import useSWR from 'swr';
import Loading from '@/components/layout/loading';

export default function PaymentStatus () {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id;

  const { data, isLoading } = useSWR(
    transactionId ? `/api/transaction/${transactionId}` : null
  );

  const getTransactionAndTotals = () => {
    const ticketType = data.transaction.ticketType ?? { price: 0, quantity: 0 };
    const subtotal = ticketType.price * ticketType.quantity;
    const adminFee = Math.round(
      subtotal * ((data.transaction.adminFee ?? 0) / 100)
    );
    const paymentMethodFee = data.transaction.paymentMethod.paymentMethodFee;
    const pb1 = Math.round(
      subtotal * Number(process.env.NEXT_PUBLIC_PB1 || 0.1)
    );
    const totalPayment = subtotal + adminFee + pb1 + paymentMethodFee;
    const totals = { subtotal, adminFee, paymentMethodFee, pb1, totalPayment };
    return { totals };
  };

  const handleButtonClick = () => {
    if (data.transaction.status === 'paid') {
      router.push(`/transaction/${data.transaction.id}/tickets`);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (
      data &&
      data.transaction &&
      data.transaction.status !== 'failed' &&
      data.transaction.status !== 'paid'
    ) {
      router.push(`/transaction/${transactionId}`);
    }
  }, [data, router]);

  if (isLoading) return <Loading />;
  if (!isLoading && !data)
    return (
      <Container>
        <Box className="text-muted flex h-[200px] items-center justify-center">
          No data
        </Box>
      </Container>
    );

  return (
    <Container className="flex justify-center">
      <Box className="mb-20 min-w-full px-4 sm:min-w-[378px] sm:px-0">
        <Typography
          type="heading"
          size={30}
          color="text-white"
          className="mb-2">
          {data.transaction.status === 'paid' ? 'Youre All Set!' : 'Oopsie...'}
        </Typography>

        <Box className="border bg-white p-6 shadow-[4px_4px_0px_0px_#fff]">
          {data.transaction.status === 'paid' ? (
            <Box className="flex flex-col items-center justify-center">
              <Image src={successStatus} alt="status" width={64} height={64} />
              <Typography type="heading" size={24} className="mt-4">
                Wu-hoo!
              </Typography>
            </Box>
          ) : (
            <Box className="flex flex-col items-center justify-center">
              <Image src={failedStatus} alt="status" width={64} height={64} />
            </Box>
          )}

          <Box className="border-gray my-6 rounded-[14px] border-[0.5px] p-[14px]">
            <Box className="flex items-center gap-2">
              {data.transaction.event.eventOrganizer?.event_organizer_pic ? (
                <Image
                  src={
                    data.transaction.event.eventOrganizer?.event_organizer_pic
                  }
                  alt="logo"
                  width={48}
                  height={48}
                />
              ) : (
                <Box className="border-gray h-12 w-12 rounded-[14px] border bg-white"></Box>
              )}
              <Box>
                <Typography type="heading" size={22}>
                  {data.transaction.event.eventOrganizer?.name}
                </Typography>
                <Typography type="body" size={12} className="font-light">
                  Transaction Number:{' '}
                  <span className="font-bold">
                    {data.transaction.transactionNumber}
                  </span>
                </Typography>
              </Box>
            </Box>

            <Image
              src={dashedDivider}
              alt="Dashed Divider"
              className="my-2 w-full"
            />

            {/* {data.transaction.ticketType.map((t: any, idx: number) => ( */}
            {/* <Box key={t.id} className="mt-3 border-l-2 border-black pl-2"> */}
            <Box className="mt-3 border-l-2 border-black pl-2">
              <Typography type="body" size={12} className="mb-1 font-bold">
                {data.transaction.ticketType.name}
              </Typography>
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-light">
                Total ticket: {data.transaction.ticketType.quantity} Tiket
              </Typography>
            </Box>
            {/* ))} */}
          </Box>

          <Typography type="heading" size={22} className="mb-4">
            Transaction Details
          </Typography>
          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              Transaction Date
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {formatDate(data.transaction.createdAt, 'date')}
            </Typography>
          </Box>
          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              Transaction Number
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {data.transaction.transactionNumber}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              Payment Method
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {data.transaction.paymentMethod.name}
            </Typography>
          </Box>

          <hr className="border-muted my-4 border-[0.5px]" />

          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              Subtotal
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {formatRupiah(getTransactionAndTotals().totals.subtotal)}
            </Typography>
          </Box>
          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-light">
              Payment Method Fee
            </Typography>
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-bold">
              {formatRupiah(getTransactionAndTotals().totals.paymentMethodFee)}
            </Typography>
          </Box>
          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              Admin Fee
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {formatRupiah(getTransactionAndTotals().totals.adminFee)}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              PB1
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {formatRupiah(getTransactionAndTotals().totals.pb1)}
            </Typography>
          </Box>

          <hr className="border-muted my-4 border-[0.5px]" />

          <Box className="flex justify-between">
            <Typography
              type="body"
              size={12}
              className="font-light"
              color="text-muted">
              Total Payment
            </Typography>
            <Typography
              type="body"
              size={12}
              className="font-bold"
              color="text-muted">
              {formatRupiah(getTransactionAndTotals().totals.totalPayment)}
            </Typography>
          </Box>

          <Button
            id="view_tickets_button"
            onClick={handleButtonClick}
            className="mx-auto mt-6 block">
            {data.transaction.status === 'paid'
              ? 'View Tickets'
              : 'Back to Home'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
