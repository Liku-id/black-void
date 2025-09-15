'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Image from 'next/image';
import { Typography, Container, Box, Button } from '@/components';
import paymentInstructionsRaw from '@/components/payment/transaction-instruction-modal/payment-instructions.json';
import {
  formatCountdownTime,
  formatDate,
  formatRupiah,
} from '@/utils/formatter';
import copyIcon from '@/assets/icons/copy.svg';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';
import dashedDivider from '@/assets/images/dashed-divider.svg';

const PaymentInstructionModal = dynamic(
  () => import('@/components/payment/transaction-instruction-modal'),
  { ssr: false }
);

const paymentInstructions: Record<string, { name: string; steps: string[] }> =
  paymentInstructionsRaw;

export default function PaymentConfirmationVA({
  data,
  mutate,
  secondsLeft,
}: {
  data: any;
  mutate: any;
  secondsLeft: number;
}) {
  // Initialize State
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false); // For toggling detail display
  const [showInstruction, setShowInstruction] = useState(false);

  const instruction =
    paymentInstructions[
      data && data.transaction && data.transaction.paymentMethod.name
    ];

  const getTransactionAndTotals = () => {
    const ticketType = data.transaction.ticketType ?? { price: 0, quantity: 0 };
    const subtotal = ticketType.price * data.transaction.orderQuantity;
    const adminFee =
      (data.transaction.event.adminFee ?? 0) <= 100
        ? Math.round(subtotal * ((data.transaction.event.adminFee ?? 0) / 100))
        : Math.round(data.transaction.event.adminFee ?? 0);
    const paymentMethodFee =
      data.transaction.paymentMethod.paymentMethodFee < 1
        ? Math.round(
            (subtotal * data.transaction.paymentMethod.paymentMethodFee) / 100
          )
        : data.transaction.paymentMethod.paymentMethodFee;
    const pb1 = Math.round(subtotal * (data.transaction.event.tax / 100));
    const totalPayment = subtotal + adminFee + pb1 + paymentMethodFee;
    const totals = { subtotal, adminFee, paymentMethodFee, pb1, totalPayment };
    return { totals };
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
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
              <span className="font-bold">
                {data.transaction.transactionNumber}
              </span>
            </Typography>
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="mb-6 font-light">
              Complete your booking in:{' '}
              <span className="text-red font-bold">
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
                {data.transaction.event.name}
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
                {formatDate(new Date(data.transaction.createdAt), 'date')}
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
                {data.transaction.paymentMethod.name}
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
                {data.transaction.paymentDetails.va.accountNumber}
              </Typography>
              <Box
                onClick={() =>
                  handleCopy(data.transaction.paymentDetails.va.accountNumber)
                }
                className="relative cursor-pointer">
                <Image src={copyIcon} alt="copy" width={24} height={24} />
                {copiedText ===
                  data.transaction.paymentDetails.va.accountNumber && (
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
                {formatRupiah(getTransactionAndTotals().totals.totalPayment)}
              </Typography>
              <Box
                onClick={() =>
                  handleCopy(
                    getTransactionAndTotals().totals.totalPayment.toString()
                  )
                }
                className="relative cursor-pointer">
                <Image src={copyIcon} alt="copy" width={24} height={24} />
                {copiedText ===
                  getTransactionAndTotals().totals.totalPayment.toString() && (
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
                onClick={() => setShowDetail(prev => !prev)}>
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
                  {formatRupiah(
                    getTransactionAndTotals().totals.paymentMethodFee
                  )}
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
                  {formatRupiah(getTransactionAndTotals().totals.adminFee)}
                </Typography>
              </Box>
              <Box className="mb-2 flex justify-between">
                <Typography
                  type="body"
                  size={12}
                  color="text-muted"
                  className="font-light">
                  Tax
                </Typography>
                <Typography
                  type="body"
                  size={12}
                  color="text-muted"
                  className="font-bold">
                  {formatRupiah(getTransactionAndTotals().totals.pb1)}
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
                  {formatRupiah(getTransactionAndTotals().totals.totalPayment)}
                </Typography>
              </Box>
            </Box>

            <Image
              src={dashedDivider}
              alt="Dashed Divider"
              className="mb-3 w-full"
            />

            <Box className="my-6 flex justify-center">
              <Button
                className="h-[32px] border border-black bg-white px-2 text-[12px] font-light text-black"
                onClick={() => setShowInstruction(true)}>
                See Payment Instruction
              </Button>
            </Box>

            <Box className="flex justify-center">
              <Button id="confirm_payment_button" onClick={mutate}>
                Confirm Payment
              </Button>
            </Box>

            <PaymentInstructionModal
              instruction={instruction}
              open={showInstruction}
              onClose={() => setShowInstruction(false)}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
}
