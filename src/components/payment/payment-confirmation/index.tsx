'use client';
import { useState } from 'react';
import { Typography, Container, Box, Button } from '@/components';
import { useCountdown } from '@/utils/timer';
import {
  formatCountdownTime,
  formatDate,
  formatRupiah,
} from '@/utils/formatter';
import Image from 'next/image';
import copyIcon from '@/assets/icons/copy.svg';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';
import dashedDivider from '@/assets/images/dashed-divider.svg';
import paymentInstructionsRaw from '@/components/payment/payment-instruction-modal/payment-instructions.json';
import PaymentInstructionModal from '@/components/payment/payment-instruction-modal';

const paymentInstructions: Record<string, { name: string; steps: string[] }> =
  paymentInstructionsRaw;

interface PaymentConfirmationProps {
  transaction: any;
  totals: {
    subtotal: number;
    adminFee: number;
    pb1: number;
    totalPayment: number;
  };
}

export default function PaymentConfirmation({
  transaction,
  totals,
}: PaymentConfirmationProps) {
  // Initialize State
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  // Countdown logic
  const expiredAtStr = transaction.expiredAt;
  const expiredAt = expiredAtStr ? new Date(expiredAtStr) : null;
  const now = new Date();
  const initialSeconds = expiredAt
    ? Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / 1000))
    : 300;
  const [secondsLeft] = useCountdown(initialSeconds);

  const instruction =
    paymentInstructions[transaction.paymentMethod.bankType || 'bca'];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleConfirmPayment = () => {
    // TODO: Implement payment confirmation logic
    console.log(
      'Confirming payment for transaction:',
      transaction.transactionNumber
    );
  };

  return (
    <Container className="flex justify-center">
      <Box className="mb-20 min-w-full px-4 sm:min-w-[378px] sm:px-0">
        <Typography
          type="heading"
          size={30}
          color="text-white"
          className="mb-2">
          Payment Confirmation
        </Typography>

        <Box className="border bg-white p-6 shadow-[4px_4px_0px_0px_#fff]">
          <Typography type="body" size={14} className="mb-1 font-light">
            Transaction Number:{' '}
            <span className="font-bold">{transaction.transactionNumber}</span>
          </Typography>
          <Typography
            type="body"
            size={12}
            color="text-muted"
            className="mb-6 font-light">
            Complete your booking in:{' '}
            <span className="text-base text-red-500">
              {formatCountdownTime(secondsLeft)}
            </span>
          </Typography>

          <Typography type="heading" size={24} className="mb-2">
            Details Order
          </Typography>
          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-light">
              Event Name
            </Typography>
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-bold">
              {transaction.event.name}
            </Typography>
          </Box>
          <Box className="mb-2 flex justify-between">
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-light">
              Transaction Date
            </Typography>
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-bold">
              {formatDate(new Date(transaction.createdAt), 'date')}
            </Typography>
          </Box>
          <Box className="mb-6 flex justify-between">
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-light">
              Payment Method
            </Typography>
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-bold">
              Virtual Account
            </Typography>
          </Box>
          <hr className="border-muted mb-6 border-[0.5px]" />
          <Typography type="heading" size={24} className="mb-2">
            Transaction Details
          </Typography>
          <Typography type="body" size={12} color="text-muted">
            Virtual Account Number
          </Typography>
          <Box className="mb-3 flex items-center justify-between">
            <Typography type="body" size={14} className="font-bold">
              {transaction.paymentMethod.number}
            </Typography>
            <Box
              onClick={() => handleCopy(transaction.paymentMethod.number)}
              className="relative cursor-pointer">
              <Image src={copyIcon} alt="copy" width={24} height={24} />
              {copiedText === transaction.paymentMethod.number && (
                <Box className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white">
                  Copied!
                </Box>
              )}
            </Box>
          </Box>

          <Typography type="body" size={12} color="text-muted">
            Total Amount
          </Typography>
          <Box className="mb-4 flex items-center justify-between">
            <Typography type="body" size={14} className="font-bold">
              {formatRupiah(totals.totalPayment)}
            </Typography>
            <Box
              onClick={() => handleCopy(totals.totalPayment.toString())}
              className="relative cursor-pointer">
              <Image src={copyIcon} alt="copy" width={24} height={24} />
              {copiedText === totals.totalPayment.toString() && (
                <Box className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white">
                  Copied!
                </Box>
              )}
            </Box>
          </Box>

          {/* Accordion See Details */}
          <Box className="flex justify-center">
            <Box
              className="flex cursor-pointer items-center gap-2 underline select-none"
              onClick={() => setShowDetail(v => !v)}>
              <Typography type="body" size={12} color="text-muted">
                {showDetail ? 'Hide Details' : 'See Details'}
              </Typography>
              <Image
                src={accordionArrow}
                alt="arrow"
                width={16}
                height={16}
                className={
                  (showDetail ? 'rotate-180 ' : '') +
                  'transition-transform duration-300'
                }
              />
            </Box>
          </Box>

          {/* Expanded Details */}
          <Box
            className={
              'mb-2 overflow-hidden transition-all duration-300 ' +
              (showDetail ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')
            }>
            <Box className="my-2 flex justify-between">
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-light">
                Subtotal
              </Typography>
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-bold">
                {formatRupiah(totals.subtotal)}
              </Typography>
            </Box>
            <Box className="mb-2 flex justify-between">
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-light">
                Admin Fee
              </Typography>
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-bold">
                {formatRupiah(totals.adminFee)}
              </Typography>
            </Box>
            <Box className="mb-2 flex justify-between">
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-light">
                PB1
              </Typography>
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-bold">
                {formatRupiah(totals.pb1)}
              </Typography>
            </Box>
            <hr className="border-muted my-4 border-[0.5px]" />
            <Box className="flex justify-between">
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-light">
                Total Payment
              </Typography>
              <Typography
                type="body"
                size={12}
                color="text-muted"
                className="font-bold">
                {formatRupiah(totals.totalPayment)}
              </Typography>
            </Box>
          </Box>

          <Image
            src={dashedDivider}
            alt="Dashed Divider"
            className="mb-3 w-full"
          />

          {/* Tombol See Payment Instruction */}
          <Box className="my-6 flex justify-center">
            <Button
              className="h-[32px] border border-black bg-white px-2 text-[12px] font-light text-black"
              onClick={() => setShowInstruction(true)}>
              See Payment Instruction
            </Button>
          </Box>

          <Box className="flex justify-center">
            <Button id="confirm_payment_button" onClick={handleConfirmPayment}>
              Confirm Payment
            </Button>
          </Box>

          {/* Modal Payment Instruction */}
          <PaymentInstructionModal
            instruction={instruction}
            open={showInstruction}
            onClose={() => setShowInstruction(false)}
          />
        </Box>
      </Box>
    </Container>
  );
}
