import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Box, Button, Typography } from '@/components';
import { formatRupiah } from '@/utils/formatter';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';
import dashedDivider from '@/assets/images/dashed-divider.svg';
import TicketList from './ticket-list';
import PriceDetail from './price-detail';
import PaymentMethodAccordion from './payment-method';
import { UseFormReturn } from 'react-hook-form';
import type { TicketSummary, FormDataVisitor } from '../types';

interface SummarySectionProps {
  eventData?: any;
  tickets: TicketSummary[];
  isContactValid?: boolean;
  isVisitorValid: boolean;
  visitorMethods: UseFormReturn<FormDataVisitor>;
}

const SummarySectionMobile: React.FC<SummarySectionProps> = ({
  eventData,
  tickets,
  isContactValid,
  isVisitorValid,
  visitorMethods,
}) => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const pathname = usePathname();
  const isOrderPage = pathname.endsWith('/order');

  // Initialize State
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const ticketCount = tickets.reduce((a, t) => a + t.count, 0);
  const totalPrice = tickets.reduce(
    (sum, t) => sum + t.count * Number(t.price),
    0
  );
  const adminFee = eventData
    ? Math.round((totalPrice * eventData.adminFee) / 100)
    : 0;
  const pb1Rate = Number(process.env.NEXT_PUBLIC_PB1) || 0.1;
  const tax = Math.round(totalPrice * pb1Rate);
  const grandTotal = totalPrice + adminFee + tax;

  const handleSeeDetails = () => {
    setShowDetail(v => !v);
  };

  const handleContinue = () => {
    if (isOrderPage) {
      setShowPaymentMethod(false);
      const visitorData = visitorMethods.getValues();
      console.log(visitorData);
      console.log(selectedPayment);
    } else {
      router.push(`/event/${slug}/order`);
    }
  };

  function getContinueDisabled() {
    if (isOrderPage) {
      return !isContactValid || !isVisitorValid || !selectedPayment;
    }
    return ticketCount === 0;
  }

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
            title="Virtual Account"
            methods={eventData?.paymentMethods || []}
            filterKey="VIRTUAL ACCOUNT"
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />

          <PaymentMethodAccordion
            title="QRIS"
            methods={eventData?.paymentMethods || []}
            filterKey="QRIS"
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
          <Box className="mb-4" />
        </>
      )}

      <Button
        id="continue_button"
        className="h-12 w-full"
        onClick={handleContinue}
        disabled={getContinueDisabled()}>
        Continue
      </Button>
    </Box>
  );
};

export default SummarySectionMobile;
