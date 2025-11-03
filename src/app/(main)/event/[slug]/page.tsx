'use client';
import useSWR from 'swr';
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import axios from 'axios';
import { Box, Container, Button, Typography, Modal } from '@/components';
import EventDetailSection from '@/components/event/event-detail-section';
import EventPageSkeleton from '@/components/event/skeletons';
import TicketListSection from '@/components/event/ticket-list-section';
import SummarySection from '@/components/event/summary-section';
import SummarySectionMobile from '@/components/event/summary-section/mobile';
import OwnerSection from '@/components/event/owner-section';
import Loading from '@/components/layout/loading';
import useStickyObserver from '@/utils/sticky-observer';
import { orderBookingAtom } from '@/store/atoms/order';
import { useAuth } from '@/lib/session/use-auth';
import { setSessionStorage } from '@/lib/browser-storage';

export default function Event() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fetch event data
  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
  } = useSWR(slug ? `/api/events/${slug}` : null);

  // Initialize state
  const [, setOrderBooking] = useAtom(orderBookingAtom);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const selectedTickets = tickets.filter((t: any) => t.count > 0);
  const isDisabled = selectedTickets.reduce((a, t) => a + t.count, 0) === 0;
  const { isLoggedIn } = useAuth();

  // Sticky observer logic using custom hook
  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isSticky, absoluteTop, isReady } = useStickyObserver(
    stickyRef as React.RefObject<HTMLDivElement>,
    sentinelRef as React.RefObject<HTMLDivElement>,
    eventData ? 215 : 0
  );

  const handleChangeCount = (id: string, delta: number) => {
    setTickets((prev: any[]) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      // Check if event required login while trying to add a ticket
      if (delta > 0 && !isLoggedIn && eventData.login_required) {
        setShowLoginModal(true);
        return prev;
      }

      const available = Math.max(
        0,
        (target.quantity ?? 0) - (target.purchased_amount ?? 0)
      );
      const nextCount = Math.max(
        0,
        Math.min(
          target.max_order_quantity ?? Infinity,
          Math.min(available, (target.count ?? 0) + delta)
        )
      );

      if (nextCount === target.count) return prev;

      const shouldResetOthers = nextCount > 0;

      return prev.map((t) => {
        if (t.id === id) return { ...t, count: nextCount };
        if (shouldResetOthers && (t.count ?? 0) !== 0)
          return { ...t, count: 0 };
        return t;
      });
    });
  };

  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const scrollToTickets = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContinue = async () => {
    try {
      const ticket = selectedTickets[0];
      const payload = {
        tickets: [
          {
            id: ticket.id,
            quantity: ticket.count,
          },
        ],
      };

      const { data: response } = await axios.post('/api/order/create', payload);

      if (response.success) {
        setOrderBooking({
          orderId: response.data.id,
          expiredAt: response.data.expiredAt,
        });
        router.push(`/event/${slug}/order`);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.error || 'Failed to create order');
    }
  };

  const handleLoginClick = () => {
    const queryString = searchParams.toString();
    const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

    setShowLoginModal(false);
    setSessionStorage('destination', currentPath);
    router.push('/login');
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    router.push('/register');
  };

  useEffect(() => {
    if (eventData?.ticketTypes && Array.isArray(eventData.ticketTypes)) {
      setTickets(
        eventData.ticketTypes.map((t: any) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          count: 0,
          max_order_quantity: t.max_order_quantity,
          description: t.description,
          sales_start_date: t.sales_start_date,
          sales_end_date: t.sales_end_date,
          ticket_start_date: t.ticketStartDate,
          quantity: t.quantity,
          purchased_amount: t.purchased_amount,
        }))
      );
    }
  }, [eventData?.ticketTypes]);

  // Skeleton/loading
  if (eventLoading) {
    return <EventPageSkeleton />;
  }

  if (eventError || !eventData) {
    return (
      <Container className="py-16">
        <Box className="text-red-500">Failed to load event data</Box>
      </Container>
    );
  }

  return (
    <main>
      {loading && <Loading />}
      <Container className="relative mx-auto flex max-w-[1440px]">
        {/* Left: Main event content, responsive width */}
        <Box className="flex-1 overflow-hidden">
          <Container className="flex gap-20 px-4 lg:px-8 xl:gap-16 xl:px-0">
            <Box className="w-full lg:w-5/10 lg:max-w-5/10 xl:w-6/10 xl:max-w-6/10">
              <EventDetailSection
                data={eventData}
                onChooseTicket={scrollToTickets}
              />
            </Box>
            <Box className="hidden lg:block lg:w-5/10 lg:max-w-5/10 xl:w-4/10 xl:max-w-4/10" />
          </Container>

          {/* Ticket list section, same responsive layout */}
          <Box className="bg-light-gray relative">
            <Box className="absolute -top-24" ref={ticketSectionRef} />
            <Container className="flex gap-20 px-4 lg:px-8 xl:gap-16 xl:px-0">
              <Box className="w-full max-w-full py-8 lg:w-5/10 lg:max-w-5/10 lg:py-14 xl:w-6/10 xl:max-w-6/10">
                <TicketListSection
                  data={eventData}
                  tickets={tickets}
                  handleChangeCount={handleChangeCount}
                />
              </Box>
              <Box className="hidden w-5/10 max-w-5/10 lg:block xl:w-4/10 xl:max-w-4/10" />
            </Container>
          </Box>
        </Box>

        {/* DESKTOP: Sticky summary section (right column) */}
        <Box
          ref={stickyRef}
          className={
            (isSticky
              ? 'sticky top-30 right-8 bottom-10 -ml-[455px] w-[455px] self-start xl:right-37.5 xl:w-[455px] 2xl:right-[708px]'
              : 'absolute right-8 w-[455px] xl:right-37.5 xl:w-[455px]') +
            ' z-1 hidden lg:block'
          }
          // Only apply absolute top when not sticky and ready
          style={!isSticky && isReady ? { top: absoluteTop } : {}}
        >
          <SummarySection
            eventData={eventData}
            tickets={selectedTickets}
            onContinue={handleContinue}
            disabled={isDisabled}
            error={error}
          />
        </Box>

        {/* MOBILE: Sticky summary section (right column) */}
        <Box className="fixed bottom-0 left-0 z-1 block w-full lg:hidden">
          <SummarySectionMobile
            eventData={eventData}
            tickets={selectedTickets}
            onContinue={handleContinue}
            disabled={isDisabled}
            error={error}
          />
        </Box>
      </Container>

      {/* invisible box to trigger sticky/absolute switch */}
      <Box ref={sentinelRef} className="absolute" />

      <Container className="relative mx-auto flex">
        <Box className="flex-1 px-4 pt-12 lg:pt-15">
          <OwnerSection
            eventOrganizer={eventData.eventOrganizer}
            termAndConditions={eventData.termAndConditions}
          />
        </Box>
      </Container>

      {/* Login Modal */}
      <Modal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Already have account?"
        className="md:w-[454px]"
        footer={
          <Box className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleLoginClick}
              className="border border-white bg-transparent px-6 py-3 text-white"
            >
              Get In
            </Button>
            <Button
              type="button"
              onClick={handleRegisterClick}
              className="border border-green bg-green px-6 py-3 text-white"
            >
              Register Account
            </Button>
          </Box>
        }
      >
        <Box className="mb-6">
          <Typography type="body" size={14} color="text-white">
            You can get this ticket by register/sign up an account first.
          </Typography>
        </Box>
      </Modal>
    </main>
  );
}
