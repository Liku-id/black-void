'use client';
import { useEffect, useRef, useCallback } from 'react';
import { Container, Box } from '@/components';
import EventCard from '../event-card';
import { useEvents } from '@/hooks/use-events';
import { formatDate, formatRupiah } from '@/utils/formatter';

export default function EventListSection() {
  const { events, error, isLoading, isLoadingMore, isReachingEnd, isEmpty, loadMore } =
    useEvents();

  // Sentinel ref for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    [loadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleIntersect]);

  const renderSkeletons = (count = 12) =>
    [...Array(count)].map((_, idx) => <EventCard key={`sk-${idx}`} skeleton />);

  const renderEvents = () =>
    events.map(event => (
      <EventCard
        key={event.id}
        metaUrl={event.metaUrl}
        image={event.eventAssets?.[0]?.asset?.url}
        title={event.name}
        location={event.address || '-'}
        status={event.eventStatus}
        date={
          event.lowestPriceTicketType?.ticketStartDate
            ? formatDate(event.lowestPriceTicketType.ticketStartDate, 'date')
            : '-'
        }
        price={
          event.lowestPriceTicketType?.price
            ? formatRupiah(event.lowestPriceTicketType.price)
            : 'Free'
        }
      />
    ));

  const renderContent = () => {
    if (error) {
      return (
        <Box className="col-span-full flex h-[336px] items-center justify-center text-lg text-red-500">
          Failed to load events
        </Box>
      );
    }

    if (isLoading) return renderSkeletons();

    if (isEmpty) {
      return (
        <Box className="text-muted col-span-full flex h-[336px] items-center justify-center text-lg">
          No events found
        </Box>
      );
    }

    return renderEvents();
  };

  return (
    <section id="event-list" className="my-8 lg:my-24">
      <Container className="px-4">
        <Box className="grid grid-cols-1 gap-[20px] sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
          {renderContent()}

          {/* Loading more skeletons */}
          {isLoadingMore && !isLoading && renderSkeletons(4)}
        </Box>

        {/* Infinite scroll sentinel */}
        {!isReachingEnd && !error && (
          <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
        )}

        {/* End-of-list indicator */}
        {isReachingEnd && !isEmpty && (
          <Box className="text-muted mt-8 flex items-center justify-center gap-2 text-sm">
            <span className="h-px w-16 bg-current opacity-30" />
            <span>You&apos;ve seen all events</span>
            <span className="h-px w-16 bg-current opacity-30" />
          </Box>
        )}
      </Container>
    </section>
  );
}

