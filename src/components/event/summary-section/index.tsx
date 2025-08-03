import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
// import axios from 'axios';
import { Box, Button, Typography } from '@/components';
import TicketList from './ticket-list';
import PriceDetail from './price-detail';
import PaymentMethodAccordion from './payment-method';
import Loading from '@/components/layout/loading';
import type { TicketSummary, FormDataVisitor } from '../types';
import dashedDivider from '@/assets/images/dashed-divider.svg';
import { formatRupiah } from '@/utils/formatter';

interface SummarySectionProps {
  eventData?: any;
  tickets: TicketSummary[];
  isContactValid?: boolean;
  isVisitorValid?: boolean;
  visitorMethods?: UseFormReturn<FormDataVisitor>;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleContinue = async () => {
    if (isOrderPage) {
      if (visitorMethods) {
        const isValid = await visitorMethods.trigger();
        if (!isValid) {
          // Scroll to visitor detail section to show errors
          const visitorSection = document.querySelector(
            '[data-visitor-section]'
          );
          if (visitorSection) {
            visitorSection.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
      }
      const visitorData = visitorMethods?.getValues();
      console.log('Proceeding with visitor data:', visitorData);
      console.log(selectedPayment);
    } else {
      setError(null);
      setLoading(true);

      try {
        //   const ticket = tickets[0];
        //   const payload = {
        //     tickets: [{
        //       id: ticket.id,
        //       quantity: ticket.count
        //     }],
        //   };

        //   const { data: response } = await axios.post('/api/order/create', payload);
        //   console.log('Order created:', response);
        router.push(`/event/${slug}/order`);
      } catch (error: any) {
        setError(error?.response?.data?.error || 'Failed to create order');
      } finally {
        setLoading(false);
      }
    }
  };

  function getContinueDisabled() {
    if (isOrderPage) {
      return !isContactValid || !isVisitorValid || !selectedPayment;
    }
    return ticketCount === 0;
  }

  if (loading) return <Loading />;
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
            id="va_payment_dropdown"
            title="Virtual Account"
            methods={eventData?.paymentMethods || []}
            filterKey="VIRTUAL ACCOUNT"
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
          <PaymentMethodAccordion
            id="qris_payment_dropdown"
            title="QRIS"
            methods={eventData?.paymentMethods || []}
            filterKey="QRIS"
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
        </Box>
      )}

      {error && (
        <Typography type="body" size={12} color="text-red" className="mt-6">
          {error}
        </Typography>
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
