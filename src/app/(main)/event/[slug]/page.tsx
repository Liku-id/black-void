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
import EventModals from '@/components/event/event-modals';
import Loading from '@/components/layout/loading';
import { orderBookingAtom } from '@/store/atoms/order';
import { useAuth } from '@/lib/session/use-auth';
import { setSessionStorage } from '@/lib/browser-storage';
import { getTodayWIB, convertToWIB } from '@/utils/formatter';

export default function Event() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const partnerCode = searchParams.get('partner_code');

  // Build API URL with query params (preview_token is handled via cookie in middleware)
  const buildApiUrl = () => {
    if (!slug) return null;

    const params = new URLSearchParams();
    if (partnerCode) {
      params.append('partner_code', partnerCode);
    }

    const queryString = params.toString();
    return queryString
      ? `/api/events/${slug}?${queryString}`
      : `/api/events/${slug}`;
  };
  const apiUrl = buildApiUrl();

  // Fetch event data
  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
  } = useSWR(apiUrl);

  // Initialize state
  const [, setOrderBooking] = useAtom(orderBookingAtom);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showEventEndedModal, setShowEventEndedModal] = useState(false);
  const selectedTickets = tickets
    .filter((t: any) => t.count > 0)
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      price: String(t.price),
      count: t.count,
      partnership_info: t.partnership_info || null,
    }));
  const isDisabled =
    selectedTickets.reduce((a, t) => a + t.count, 0) === 0 ||
    eventData?.eventStatus === 'draft';
  const { isLoggedIn } = useAuth();

  const handleChangeCount = (id: string, delta: number) => {
    setTickets((prev: any[]) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      // Check if event required login or free ticket while trying to add a ticket
      if (
        delta > 0 &&
        !isLoggedIn &&
        (target.price === 0 || eventData.login_required)
      ) {
        setShowLoginModal(true);
        return prev;
      }

      // Use partnership_info values if partner_code exists
      const partnershipInfo = target.partnership_info;
      const usePartnership = partnerCode && partnershipInfo;

      // Determine available quota and max order quantity
      const available =
        usePartnership && partnershipInfo.available_quota !== undefined
          ? partnershipInfo.available_quota
          : Math.max(
              0,
              (target.quantity ?? 0) - (target.purchased_amount ?? 0)
            );

      const maxOrderQuantity =
        usePartnership && partnershipInfo.max_order_quantity !== undefined
          ? partnershipInfo.max_order_quantity
          : (target.max_order_quantity ?? Infinity);

      // Prevent purchase if available_quota is 0 or less when using partnership
      if (usePartnership && available <= 0) {
        return prev;
      }

      const nextCount = Math.max(
        0,
        Math.min(
          maxOrderQuantity,
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
      const payload: any = {
        tickets: [
          {
            id: ticket.id,
            quantity: ticket.count,
            partnerCode: partnerCode ?? null,
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

  const handleExpiredBuyTicket = () => {
    setShowExpiredModal(false);
    // Remove partner_code from URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('partner_code');
    const newQueryString = newParams.toString();
    const newPath = newQueryString ? `${pathname}?${newQueryString}` : pathname;
    router.replace(newPath);
  };

  const handleGoToHomepage = () => {
    setShowEventEndedModal(false);
    router.push('/');
  };

  useEffect(() => {
    if (eventData?.ticketTypes && Array.isArray(eventData.ticketTypes)) {
      setTickets(
        eventData.ticketTypes.map((t: any) => {
          const partnershipInfo = t.partnership_info;
          const usePartnership = partnerCode && partnershipInfo;

          // Use partnership_info.max_order_quantity if partner_code exists
          const maxOrderQuantity =
            usePartnership && partnershipInfo?.max_order_quantity !== undefined
              ? partnershipInfo.max_order_quantity
              : t.max_order_quantity;

          return {
            id: t.id,
            name: t.name,
            price: t.price,
            count: 0,
            max_order_quantity: maxOrderQuantity,
            description: t.description,
            sales_start_date: t.sales_start_date,
            sales_end_date: t.sales_end_date,
            ticket_start_date: t.ticketStartDate,
            quantity: t.quantity,
            purchased_amount: t.purchased_amount,
            partnership_info: partnershipInfo || null,
          };
        })
      );
    }
  }, [eventData?.ticketTypes, partnerCode]);

  // Handle 403 error - redirect to /event with message
  useEffect(() => {
    if (!eventLoading && eventData) {
      if (eventData.success === false) {
        router.replace('/');
      }
    }
  }, [eventData, eventLoading, router]);

  // Check if partner code is expired (only if event hasn't ended)
  useEffect(() => {
    if (!eventLoading && eventData && partnerCode && eventData.ticketTypes) {
      // First check if event has ended - if so, don't show expired partner code modal
      if (eventData.endDate) {
        const endDate = convertToWIB(eventData.endDate);
        const now = getTodayWIB();
        const isEventEnded = now > endDate;

        if (isEventEnded) {
          // Event has ended, don't show expired partner code modal
          return;
        }
      }

      // Check if any ticket has partnership_info with expired_at
      const hasExpiredPartnerCode = eventData.ticketTypes.some(
        (ticket: any) => {
          const partnershipInfo = ticket.partnership_info;

          if (partnershipInfo && partnershipInfo.expired_at) {
            const expiredAt = convertToWIB(partnershipInfo.expired_at);
            const now = getTodayWIB();
            const isExpired = now > expiredAt;

            return isExpired;
          }
          return false;
        }
      );

      if (hasExpiredPartnerCode) {
        setShowExpiredModal(true);
      }
    }
  }, [eventData, eventLoading, partnerCode]);

  // Check if event has ended (only when partner_code is present)
  useEffect(() => {
    if (!eventLoading && eventData && eventData.endDate && partnerCode) {
      const endDate = convertToWIB(eventData.endDate);
      const now = getTodayWIB();
      const isEventEnded = now > endDate;

      if (isEventEnded) {
        setShowEventEndedModal(true);
        // Close expired modal if event has ended (priority)
        setShowExpiredModal(false);
      }
    }
  }, [eventData, eventLoading, partnerCode]);

  // Skeleton/loading
  if (eventLoading) {
    return <EventPageSkeleton />;
  }

  if (eventError || (!eventLoading && !eventData)) {
    return (
      <Container className="py-16">
        <Box className="text-red-500">Failed to load event data</Box>
      </Container>
    );
  }

  // Don't render if eventData is error response (redirect will happen)
  if (
    eventData &&
    typeof eventData === 'object' &&
    'success' in eventData &&
    eventData.success === false
  ) {
    return null;
  }

  return (
    <main>
      {loading && <Loading />}
      <Container className="relative mx-auto flex max-w-[1440px]">
        {/* Left: Main event content, responsive width */}
        <Box className="flex-1">
          <Container className="flex">
            <EventDetailSection
              data={eventData}
              onChooseTicket={scrollToTickets}
            />
          </Container>

          {/* Ticket list section, same responsive layout */}
          <Box className="relative bg-light-gray">
            <Box className="absolute -top-24" ref={ticketSectionRef} />
            <Container className="flex flex-col gap-10 px-4 py-8 md:flex-row md:items-start md:gap-12 md:px-6 md:py-10 lg:px-8 lg:py-14 xl:gap-16 xl:px-0 xl:py-16">
              <Box className="w-full md:w-7/12 xl:w-7/12">
                <TicketListSection
                  data={eventData}
                  tickets={tickets}
                  handleChangeCount={handleChangeCount}
                />
              </Box>
              <Box className="hidden w-full md:block md:w-5/12 md:self-start md:sticky md:top-[120px] xl:w-5/12">
                <SummarySection
                  eventData={eventData}
                  tickets={selectedTickets}
                  onContinue={handleContinue}
                  disabled={isDisabled}
                  error={error}
                />
              </Box>
            </Container>
          </Box>
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

      {/* Event Modals */}
      <EventModals
        showExpiredModal={showExpiredModal}
        showEventEndedModal={showEventEndedModal}
        onCloseExpiredModal={() => setShowExpiredModal(false)}
        onCloseEventEndedModal={() => setShowEventEndedModal(false)}
        onExpiredBuyTicket={handleExpiredBuyTicket}
        onGoToHomepage={handleGoToHomepage}
      />
    </main>
  );
}
