'use client';
import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@/components';
import { EventData } from '../event-detail-section/event';
import { formatDate } from '@/utils/formatter';
import TicketCard from '../ticket-card';
import type { Ticket } from '../types';

interface TicketListSectionProps {
  data: EventData;
  tickets: Ticket[];
  handleChangeCount: (id: string, delta: number) => void;
}

const TicketListSection: React.FC<TicketListSectionProps> = ({
  data,
  tickets,
  handleChangeCount,
}) => {
  // Collect all ticket_start_date
  const dates = useMemo(() => {
    if (!data.ticketTypes) return [];
    const rawDates = data.ticketTypes
      .map((t: any) => t.ticketStartDate || t.ticket_start_date)
      .filter(Boolean);
    const unique = Array.from(new Set(rawDates));
    unique.sort();

    return unique;
  }, [data.ticketTypes]);

  const [selectedDate, setSelectedDate] = useState(dates[0] || '');
  const activeTicketId = tickets.find(t => t.count > 0)?.id;

  // Filter tickets based on date and sales period
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      if (ticket.ticket_start_date !== selectedDate) return false;
      return true;
    });
  }, [tickets, selectedDate]);

  // Render Ticket Card
  function renderTicketCard(ticket: Ticket) {
    const count = ticket.count;
    const isActive = count > 0;
    const isOtherActive = !!activeTicketId && activeTicketId !== ticket.id;
    
    return (
      <TicketCard
        key={ticket.id}
        ticket={ticket}
        count={count}
        onChange={handleChangeCount}
        isActive={isActive}
        isOtherActive={isOtherActive}
      />
    );
  }

  return (
    <section>
      <Typography type="heading" size={22} className="mb-6">
        Ticket and Category
      </Typography>
      <Box className="scrollbar-hide mb-6 flex gap-4 overflow-x-auto">
        {dates.map(date => (
          <Box
            key={date}
            id={`event_date_${date}_tab`}
            className={`min-w-max cursor-pointer px-3 py-[6px] text-center transition-shadow ${
              selectedDate === date
                ? 'border border-white bg-black text-white shadow-[4px_4px_0px_0px_#000]'
                : 'border border-[var(--color-light-gray-border)] bg-[rgba(0,0,0,0.02)] text-black'
            }`}
            onClick={() => setSelectedDate(date)}>
            <Typography type="body" size={14}>
              {formatDate(date, 'day')},
            </Typography>
            <Typography type="body" size={14} className="font-bold">
              {formatDate(date, 'date')}
            </Typography>
          </Box>
        ))}
      </Box>

      <hr className="border-muted block border-t-[0.5px] lg:hidden" />

      {filteredTickets.map(renderTicketCard)}
    </section>
  );
};

export default TicketListSection;
