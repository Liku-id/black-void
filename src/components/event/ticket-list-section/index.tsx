'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography } from '@/components';
import { EventData } from '../event-detail-section/event';
import { formatDate } from '@/utils/formatter';
import TicketCard from '../ticket-card';
import type { Ticket } from '../types';

interface TicketListSectionProps {
  tickets: Ticket[];
  handleChangeCount: (id: string, delta: number) => void;
  partnerCode?: string | null;
}

const TicketListSection: React.FC<TicketListSectionProps> = ({
  tickets,
  handleChangeCount,
  partnerCode,
}) => {
  const allDisplayTickets = tickets;

  const dates = useMemo(() => {
    const rawDates = allDisplayTickets
      .map(t => t.ticket_start_date)
      .filter(Boolean);
    const unique = Array.from(new Set(rawDates));
    unique.sort();

    return unique;
  }, [allDisplayTickets]);

  const [selectedDate, setSelectedDate] = useState('');

  // Set initial selected date
  useEffect(() => {
    if (dates.length > 0) {
      // If no date selected or selected is invalid
      if (!selectedDate || !dates.includes(selectedDate)) {
        setSelectedDate((dates[0] as string) || '');
      }
    }
  }, [dates, selectedDate]);


  const activeTicketId = allDisplayTickets.find(t => t.count > 0)?.id;
  const hasDates = dates.length > 0;

  // Filter tickets based on date and sales period
  const filteredTickets = useMemo(() => {
    return allDisplayTickets.filter(ticket => {
      if (partnerCode && (!ticket.partnership_info || ticket.partnership_info === null)) {
        return false;
      }
      if (ticket.ticket_start_date !== selectedDate) return false;
      return true;
    });
  }, [allDisplayTickets, selectedDate, partnerCode]);

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
      <Typography as="h2" type="heading" size={22} className="mb-6">
        Ticket and Category
      </Typography>
      {hasDates ? (
        <>
          <Box className="scrollbar-hide mb-6 flex gap-4 overflow-x-auto">
            {dates.map((date: any) => (
              <Box
                key={date}
                id={`event_date_${date}_tab`}
                className={`min-w-max cursor-pointer px-3 py-[6px] text-center transition-shadow ${selectedDate === date
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
        </>
      ) : (
        <Box className="flex items-center justify-center rounded-lg px-4 py-16">
          <Typography type="body" size={14}>
            No tickets available
          </Typography>
        </Box>
      )}
    </section>
  );
};

export default TicketListSection;
