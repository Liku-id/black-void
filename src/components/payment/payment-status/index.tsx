'use client';
import React from 'react';
import { Typography, Container, Box, Button } from '@/components';
import { useRouter } from 'next/navigation';
import { formatDate, formatRupiah } from '@/utils/formatter';
import Image from 'next/image';
import successStatus from '@/assets/icons/success-status.svg';
import failedStatus from '@/assets/icons/failed-status.svg';
import dashedDivider from '@/assets/images/dashed-divider.svg';

interface PaymentStatusProps {
  transaction: any;
  totals: {
    subtotal: number;
    adminFee: number;
    pb1: number;
    totalPayment: number;
  };
}

export default function PaymentStatus({
  transaction,
  totals,
}: PaymentStatusProps) {
  const router = useRouter();

  const handleButtonClick = () => {
    if (transaction.status === 'PAID') {
      router.push(`/transaction/${transaction.id}/tickets`);
    } else {
      router.push('/');
    }
  };

  return (
    <Container className="flex justify-center">
      <Box className="mb-20 min-w-full px-4 sm:min-w-[378px] sm:px-0">
        <Typography
          type="heading"
          size={30}
          color="text-white"
          className="mb-2">
          {transaction.status === 'PAID' ? 'Youre All Set!' : 'Oopsie...'}
        </Typography>

        <Box className="border bg-white p-6 shadow-[4px_4px_0px_0px_#fff]">
          {transaction.status === 'PAID' ? (
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
              {transaction.eventOrganizer.event_organizer_logo ? (
                <Image
                  src={transaction.eventOrganizer.event_organizer_logo}
                  alt="logo"
                  width={48}
                  height={48}
                />
              ) : (
                <Box className="border-gray h-12 w-12 rounded-[14px] border bg-white"></Box>
              )}
              <Box>
                <Typography type="heading" size={22}>
                  {transaction.eventOrganizer.name}
                </Typography>
                <Typography type="body" size={12} className="font-light">
                  Transaction Number:{' '}
                  <span className="font-bold">
                    {transaction.transactionNumber}
                  </span>
                </Typography>
              </Box>
            </Box>

            <Image
              src={dashedDivider}
              alt="Dashed Divider"
              className="my-2 w-full"
            />

            {transaction.tickets.map((t: any, idx: number) => (
              <Box key={t.id} className="mt-3 border-l-2 border-black pl-2">
                <Typography type="body" size={12} className="mb-1 font-bold">
                  {t.type}
                </Typography>
                <Typography
                  type="body"
                  size={12}
                  color="text-muted"
                  className="font-light">
                  Total ticket: {t.quantity} Tiket
                </Typography>
              </Box>
            ))}
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
              {formatDate(transaction.createdAt, 'date')}
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
              {transaction.transactionNumber}
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
              {transaction.paymentMethod.type}
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
              {formatRupiah(totals.subtotal)}
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
              {formatRupiah(totals.adminFee)}
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
              {formatRupiah(totals.pb1)}
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
              {formatRupiah(totals.totalPayment)}
            </Typography>
          </Box>

          <Button
            id="view_tickets_button"
            onClick={handleButtonClick}
            className="mx-auto mt-6 block">
            {transaction.status === 'PAID' ? 'View Tickets' : 'Back to Home'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
