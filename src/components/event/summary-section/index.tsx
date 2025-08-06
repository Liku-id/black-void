import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Box, Button, Typography } from '@/components';
import TicketList from './ticket-list';
import PriceDetail from './price-detail';
import PaymentMethodAccordion from './payment-method';
import { formatRupiah } from '@/utils/formatter';
import dashedDivider from '@/assets/images/dashed-divider.svg';
import type { TicketSummary } from '../types';

interface SummarySectionProps {
  eventData?: any;
  tickets: TicketSummary[];
  selectedPayment?: {
    id: string;
    name: string;
    paymentMethodFee: number;
  } | null;
  setSelectedPayment?: (method: {
    id: string;
    name: string;
    paymentMethodFee: number;
  }) => void;
  onContinue: () => void;
  disabled: boolean;
  error: string;
}

// Main Component
const SummarySection: React.FC<SummarySectionProps> = ({
  eventData,
  tickets,
  selectedPayment,
  setSelectedPayment,
  onContinue,
  disabled,
  error,
}) => {
  const pathname = usePathname();
  const isOrderPage = pathname.endsWith('/order');

  // Initialize State
  const [showDetail, setShowDetail] = useState(false);
  const ticketCount = tickets.reduce((a, t) => a + t.count, 0);
  const totalPrice = tickets.reduce(
    (sum, t) => sum + t.count * Number(t.price),
    0
  );
  const adminFee = Math.round((totalPrice * eventData.adminFee) / 100);
  const pb1Rate = Number(process.env.NEXT_PUBLIC_PB1) || 0.1;
  const tax = Math.round(totalPrice * pb1Rate);
  const paymentMethodFee = selectedPayment?.paymentMethodFee
    ? selectedPayment?.paymentMethodFee < 1
      ? Math.round((totalPrice * selectedPayment?.paymentMethodFee) / 100)
      : selectedPayment?.paymentMethodFee
    : 0;
  const grandTotal = totalPrice + adminFee + tax + paymentMethodFee;

  return (
    <>
      <Box className="w-full border border-black bg-white p-4 shadow-[4px_4px_0px_0px_#fff]">
        <Typography
          type="heading"
          size={20}
          color="text-black"
          className="leading-none">
          Order details
        </Typography>
        <Typography
          type="body"
          size={12}
          color="text-black"
          className="mt-4 mb-1 font-light">
          Total Payment: <span className="font-bold">{ticketCount} Ticket</span>
        </Typography>
        <Typography
          type="heading"
          size={44}
          color="text-black"
          className="mb-4 leading-none">
          {formatRupiah(grandTotal)}
        </Typography>

        <Image
          src={dashedDivider}
          alt="Dashed Divider"
          className="my-4 w-full"
        />

        {/* Ticket list */}
        {!isOrderPage && <TicketList tickets={tickets} />}

        {/* Expand/Collapse Detail */}
        <Typography
          id="open_order_detail_link"
          type="body"
          size={12}
          color="text-black"
          className="cursor-pointer text-center leading-none underline"
          onClick={() => setShowDetail(v => !v)}>
          {showDetail ? 'Hide Detail' : 'See Detail'}
        </Typography>

        <Box
          className={`overflow-hidden transition-all duration-300 ${showDetail ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {isOrderPage && <TicketList tickets={tickets} />}
          <PriceDetail
            totalPrice={totalPrice}
            paymentMethodFee={paymentMethodFee}
            adminFee={adminFee}
            tax={tax}
            className={
              showDetail ? 'pointer-events-auto' : 'pointer-events-none'
            }
          />
        </Box>

        <Image
          src={dashedDivider}
          alt="Dashed Divider"
          className="mt-4 w-full"
        />

        {isOrderPage && (
          <Box className="mt-6">
            <Typography
              type="heading"
              size={24}
              color="text-black"
              className="text-center">
              Choose your Payment Method
            </Typography>
            <PaymentMethodAccordion
              id="va_payment_dropdown"
              title="Virtual Account"
              methods={eventData?.paymentMethods || []}
              filterKey="VIRTUAL ACCOUNT"
              selectedPayment={selectedPayment || null}
              setSelectedPayment={setSelectedPayment || (() => {})}
            />
            <PaymentMethodAccordion
              id="qris_payment_dropdown"
              title="QRIS"
              methods={eventData?.paymentMethods || []}
              filterKey="QRIS"
              selectedPayment={selectedPayment || null}
              setSelectedPayment={setSelectedPayment || (() => {})}
            />
          </Box>
        )}

        {error && (
          <Typography
            type="body"
            size={12}
            color="text-red"
            className="mt-5 block text-center">
            {error}
          </Typography>
        )}

        {/* <Box className={`flex justify-center ${error ? 'mt-1' : 'mt-6'}`}> */}
        <Box className={`mt-6 flex justify-center`}>
          <Button id="continue_button" onClick={onContinue} disabled={disabled}>
            Continue
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SummarySection;
