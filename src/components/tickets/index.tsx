'use client';
import useSWR from 'swr';
import { Typography, Container, Box } from '@/components';
import TicketCard from './ticket-card';
import { TicketData } from './types';

interface TicketBuckets {
  ongoing: TicketData[];
  expired: TicketData[];
}

interface TicketListProps {
  tickets: TicketData[];
  title: string;
  className?: string;
  isExpired?: boolean;
  skeleton?: boolean;
  skeletonCount?: number;
}

export default function TicketPage() {
  // Fetch ticket history from API
  const { data, error, isLoading } = useSWR<TicketBuckets>(
    '/api/tickets/history'
  );

  const TicketList = ({
    tickets,
    title,
    className,
    isExpired,
    skeleton = false,
    skeletonCount = 3,
  }: TicketListProps) => {
    const showEmpty = !skeleton && (!tickets || tickets.length === 0);
    if (showEmpty) return null;

    return (
      <Box className={className}>
        <Typography
          type="heading"
          size={24}
          color="text-white"
          className="mb-3 font-bold uppercase"
        >
          {title}
        </Typography>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {skeleton
            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                <TicketCard key={`skeleton-${title}-${idx}`} skeleton />
              ))
            : tickets.map((ticket) => (
                <TicketCard
                  key={ticket.transaction_id}
                  ticket={ticket}
                  isExpired={isExpired}
                />
              ))}
        </div>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Container className="py-1">
        {/* Skeleton ON GOING */}
        <TicketList tickets={[]} title="ON GOING" className="mb-8" skeleton />
        {/* Skeleton EXPIRED */}
        <TicketList tickets={[]} title="EXPIRED" skeleton />
      </Container>
    );
  }

  if (error) {
    const message =
      (typeof error === 'string' && error) ||
      (error instanceof Error && error.message) ||
      'Something went wrong';
    return (
      <Box className="flex items-center justify-center bg-black my-10">
        <Box className="text-center">
          <Box className="mb-4 text-xl text-white">{message}</Box>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-white px-4 py-2 text-black transition-colors hover:bg-gray-200"
          >
            Try Again
          </button>
        </Box>
      </Box>
    );
  }

  const ongoing = data?.ongoing ?? [];
  const expired = data?.expired ?? [];

  return (
    <Container className="py-1">
      {/* ON GOING Section */}
      <TicketList tickets={ongoing} title="ON GOING" className="mb-8" />

      {/* EXPIRED Section */}
      <TicketList tickets={expired} title="EXPIRED" isExpired />

      {/* No tickets message */}
      {ongoing.length === 0 && expired.length === 0 && (
        <Box className="py-16 text-center">
          <Typography
            type="heading"
            size={24}
            color="text-white"
            className="font-bold"
          >
            You don&apos;t have any tickets yet
          </Typography>
        </Box>
      )}
    </Container>
  );
}
