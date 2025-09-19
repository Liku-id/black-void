'use client';
import useSWR from 'swr';
import { Container, Box } from '@/components';
import EventCard from '../event-card';
import { formatDate, formatRupiah } from '@/utils/formatter';

export default function EventListSection() {
  const { data, error, isLoading } = useSWR('/api/events');

  const renderSkeleton = () =>
    [...Array(4)].map((_, idx) => <EventCard key={idx} skeleton />);

  const renderEvents = () =>
    data.events.map((event: any) => (
      <EventCard
        key={event.id}
        metaUrl={event.metaUrl}
        image={event.eventAssets?.[0]?.asset?.url}
        title={event.name}
        location={event.address || '-'}
        status={event.eventStatus}
        date={event.lowestPriceTicketType?.ticketStartDate ? formatDate(event.lowestPriceTicketType?.ticketStartDate, 'date') : '-'}
        price={
          event.lowestPriceTicketType?.price
            ? formatRupiah(event.lowestPriceTicketType.price)
            : 'TBA'
        }
      />
    ));

  const renderEmpty = () => (
    <Box className="text-muted col-span-full flex h-[336px] items-center justify-center text-lg">
      No events found
    </Box>
  );

  const renderContent = () => {
    if (error) {
      return (
        <Box className="col-span-full flex h-[336px] items-center justify-center text-lg text-red-500">
          Failed to load events
        </Box>
      );
    }
    if (isLoading) return renderSkeleton();
    if (data?.events && data.events.length > 0) return renderEvents();
    return renderEmpty();
  };

  return (
    <section id="event-list" className="my-8 lg:my-24">
      <Container className="px-4">
        <Box className="grid grid-cols-1 gap-[20px] sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
          {renderContent()}
        </Box>
      </Container>
    </section>
  );
}
