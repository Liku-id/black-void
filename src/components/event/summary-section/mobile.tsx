import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Box, Button, Typography } from '@/components';
import TicketList from './ticket-list';
import PriceDetail from './price-detail';
import PaymentMethodAccordion from './payment-method';
import { formatRupiah } from '@/utils/formatter';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';
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

const SummarySectionMobile: React.FC<SummarySectionProps> = ({
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
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
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

  const handleSeeDetails = () => {
    setShowDetail(v => !v);
  };

  return (
    <Box className="bg-white p-4 shadow-[0_0_12px_0_rgba(0,0,0,0.3)]">
      {!showPaymentMethod ? (
        <>
          <Typography
            type="heading"
            size={20}
            color="text-black"
            className="mb-3 leading-none">
            Order details
          </Typography>
          <Typography
            type="body"
            size={12}
            color="text-black"
            className="font-light">
            Total Payments:{' '}
            <span className="font-bold">{ticketCount} Ticket</span>
          </Typography>
          <Box className="mt-1 flex items-start justify-between">
            <Typography
              type="heading"
              size={24}
              color="text-black"
              className="leading-none">
              {formatRupiah(grandTotal)}
            </Typography>
            <Button
              id="open_order_detail_link"
              type="button"
              onClick={handleSeeDetails}
              className="flex h-auto items-center bg-white p-0 text-[12px] font-light text-black underline">
              {showDetail ? 'Hide Detail' : 'See Detail'}
              <Image
                src={accordionArrow}
                alt="Show details"
                width={18}
                height={18}
                className={`${showDetail ? '' : 'rotate-180'} transition-transform duration-200`}
              />
            </Button>
          </Box>

          <Image
            src={dashedDivider}
            alt="Dashed Divider"
            className="my-3 w-full"
          />
          <Box
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDetail ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <TicketList tickets={tickets} />
            <PriceDetail
              totalPrice={totalPrice}
              paymentMethodFee={paymentMethodFee}
              adminFee={adminFee}
              tax={tax}
              className="pointer-events-auto"
            />
            <Image
              src={dashedDivider}
              alt="Dashed Divider"
              className="my-3 w-full"
            />
          </Box>

          {isOrderPage && (
            <Box
              id="payment_method_field"
              className="mb-4 flex items-center justify-between border border-solid border-black p-2"
              onClick={() => setShowPaymentMethod(true)}>
              <Typography
                type="body"
                className="text-sm font-light"
                color="text-muted">
                {selectedPayment
                  ? selectedPayment.name
                  : 'Choose Payment Method'}
              </Typography>
              <Image
                src={accordionArrow}
                alt="accordion arrow"
                width={24}
                height={24}
              />
            </Box>
          )}
        </>
      ) : (
        <>
          <Typography
            type="heading"
            size={20}
            color="text-black"
            className="leading-none">
            Choose Payment method
          </Typography>
          <Image
            src={dashedDivider}
            alt="Dashed Divider"
            className="mt-3 w-full"
          />

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
          <Box className="mb-4" />
        </>
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

      <Button
        id="continue_button"
        className="h-12 w-full"
        onClick={onContinue}
        disabled={disabled}>
        Continue
      </Button>
    </Box>
  );
};

export default SummarySectionMobile;
