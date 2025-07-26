import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Box, Button, Typography } from '@/components';
import { formatRupiah } from '@/utils/formatter';
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

// Main Component
const SummarySection: React.FC<SummarySectionProps> = ({
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
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const ticketCount = tickets.reduce((a, t) => a + t.count, 0);
  const totalPrice = tickets.reduce(
    (sum, t) => sum + t.count * Number(t.price),
    0
  );
  const adminFee = Math.round((totalPrice * eventData.adminFee) / 100);
  const pb1Rate = Number(process.env.NEXT_PUBLIC_PB1) || 0.1;
  const tax = Math.round(totalPrice * pb1Rate);
  const grandTotal = totalPrice + adminFee + tax;

  const handleContinue = () => {
    const visitorData = visitorMethods.getValues();
    // Lakukan logic submit/lanjut dengan visitorData
    console.log(visitorData);
    router.push(`/event/${slug}/order`);
  };

  function getContinueDisabled() {
    if (isOrderPage) {
      return !isContactValid || !isVisitorValid || !selectedPayment;
    }
    return ticketCount === 0;
  }

  return (
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

      <Image src={dashedDivider} alt="Dashed Divider" className="my-4 w-full" />

      {/* Ticket list */}
      {!isOrderPage && <TicketList tickets={tickets} />}

      {/* Expand/Collapse Detail */}
      <Typography
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
          adminFee={adminFee}
          tax={tax}
          className={showDetail ? 'pointer-events-auto' : 'pointer-events-none'}
        />
      </Box>

      <Image src={dashedDivider} alt="Dashed Divider" className="mt-4 w-full" />

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
        </Box>
      )}

      <Box className="mt-6 flex justify-center">
        <Button
          id="continue_button"
          onClick={handleContinue}
          disabled={getContinueDisabled()}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SummarySection;
