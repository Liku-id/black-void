'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Box, Container } from '@/components';
import EventDetailSection from '@/components/event/event-detail-section';
import EventPageSkeleton from '@/components/event/skeletons';
import TicketListSection from '@/components/event/ticket-list-section';
import SummarySection from '@/components/event/summary-section';
import SummarySectionMobile from '@/components/event/summary-section/mobile';
import useStickyObserver from '@/utils/sticky-observer';
import OwnerSection from '@/components/event/owner-section';

export default function Event() {
  const params = useParams();
  const slug = params?.slug as string;

  // Fetch event data
  const { data, isLoading, error } = useSWR(
    slug ? `/api/events/${slug}` : null
  );

  // Initialize state
  const [tickets, setTickets] = useState<any[]>([]);
  const selectedTickets = tickets.filter((t: any) => t.count > 0);

  // Sticky observer logic using custom hook
  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isSticky, absoluteTop, isReady } = useStickyObserver(
    stickyRef as React.RefObject<HTMLDivElement>,
    sentinelRef as React.RefObject<HTMLDivElement>,
    data ? 215 : 0
  );

  // Ticket count change handler
  const handleChangeCount = (id: string, delta: number) => {
    setTickets((prev: any) =>
      prev.map((t: any) =>
        t.id === id ? { ...t, count: Math.max(0, t.count + delta) } : t
      )
    );
  };

  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const scrollToTickets = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (data?.ticketTypes && Array.isArray(data.ticketTypes)) {
      setTickets(
        data.ticketTypes.map((t: any) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          count: 0,
          max_order_quantity: t.max_order_quantity,
          description: t.description,
          sales_start_date: t.sales_start_date,
        }))
      );
    }
  }, [data?.ticketTypes]);

  // Skeleton/loading
  if (isLoading) {
    return <EventPageSkeleton />;
  }

  if (error || !data) {
    return (
      <Container className="py-16">
        <Box className="text-red-500">Failed to load event data</Box>
      </Container>
    );
  }

  return (
    <main>
      <Container className="relative mx-auto flex max-w-[1440px]">
        {/* Left: Main event content, responsive width */}
        <Box className="flex-1 overflow-hidden">
          <Container className="flex gap-20 px-4 lg:px-8 xl:gap-16 xl:px-0">
            <Box className="w-full lg:w-5/10 lg:max-w-5/10 xl:w-6/10 xl:max-w-6/10">
              <EventDetailSection
                data={data}
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
                  data={data}
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
            ' hidden lg:block'
          }
          // Only apply absolute top when not sticky and ready
          style={!isSticky && isReady ? { top: absoluteTop } : {}}>
          <SummarySection eventData={data} tickets={selectedTickets} />
        </Box>

        {/* MOBILE: Sticky summary section (right column) */}
        <Box className="fixed bottom-0 left-0 z-50 block w-full lg:hidden">
          <SummarySectionMobile eventData={data} tickets={selectedTickets} />
        </Box>
      </Container>

      {/* invisible box to trigger sticky/absolute switch */}
      <Box ref={sentinelRef} className="absolute" />

      <Container className="relative mx-auto flex">
        <Box className="flex-1 px-4 pt-12 lg:pt-15">
          <OwnerSection
            eventOrganizer={data.eventOrganizer}
            termAndConditions={data.termAndConditions}
          />
        </Box>
      </Container>
    </main>
  );
}
