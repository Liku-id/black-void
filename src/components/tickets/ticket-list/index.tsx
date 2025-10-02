'use client';
import { Box, Typography } from '@/components';
import TicketCard from '../ticket-card';
import { TicketData } from '../types';

interface TicketListProps {
  tickets: TicketData[];
  title: string;
  className?: string;
}

export default function TicketList({
  tickets,
  title,
  className,
}: TicketListProps) {
  if (tickets.length === 0) {
    return null;
  }

  return (
    <Box className={className}>
      <Typography
        type="heading"
        size={24}
        color="text-white"
        className="font-bold uppercase mb-3"
      >
        {title}
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </Box>
  );
}
