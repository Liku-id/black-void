'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@/components';
import { formatDate } from '@/utils/formatter';
import locationPin from '@/assets/icons/location-pin.svg';
import calendar from '@/assets/icons/calendar.svg';
import { TicketData } from '../types';

interface TicketCardProps {
  ticket?: TicketData; // dibuat optional agar aman saat skeleton = true
  isExpired?: boolean;
  skeleton?: boolean;
}

export default function TicketCard({
  ticket,
  isExpired = false,
  skeleton = false,
}: TicketCardProps) {
  const router = useRouter();

  if (skeleton) {
    return (
      <Box className="bg-white border border-black p-4 shadow-[4px_4px_0px_0px_#FFF]">
        <Box className="mb-3 h-7 w-4/5 animate-pulse bg-gray-200" />

        <div className="mb-3 border-t border-gray-300" />

        <Box className="mb-2 flex items-center">
          <Box className="mr-2 h-6 w-6 animate-pulse bg-gray-200" />
          <Box className="h-4 w-1/2 animate-pulse bg-gray-100" />
        </Box>

        <Box className="flex items-center">
          <Box className="mr-2 h-6 w-6 animate-pulse bg-gray-2 00" />
          <Box className="h-4 w-1/3 animate-pulse bg-gray-100" />
        </Box>
      </Box>
    );
  }

  if (!ticket) return null;

  const textColor = isExpired ? 'text-gray-400' : 'text-black';
  const iconColor = isExpired ? 'grayscale' : '';

  const handleCardClick = () => {
    router.push(`/transaction/${ticket.transaction_id}/tickets`);
  };

  return (
    <Box
      className={`bg-white border border-black p-4 shadow-[4px_4px_0px_0px_#FFF] transition-all duration-300 hover:scale-[1.02] hover:shadow-[6px_6px_0px_0px_#FFF] cursor-pointer ${isExpired ? 'opacity-60' : ''}`}
      onClick={handleCardClick}
    >
      {/* Event Title */}
      <Typography
        type="heading"
        size={30}
        color="text-black"
        className={`uppercase mb-3 ${textColor}`}
      >
        {ticket.event_name}
      </Typography>

      {/* Divider */}
      <div
        className={`border-t border-gray-300 mb-3 ${isExpired ? 'opacity-50' : ''}`}
      />

      {/* Location */}
      <Box className="mb-2 flex items-center">
        <Image
          src={locationPin}
          alt="location"
          width={24}
          height={24}
          className={`mr-2 ${iconColor}`}
        />
        <Typography
          as="span"
          type="body"
          className={`font-onest text-[12px] leading-none font-light ${isExpired ? 'text-gray-400' : 'text-muted'}`}
        >
          {ticket.event_address}
        </Typography>
      </Box>

      {/* Date */}
      <Box className="flex items-center">
        <Image
          src={calendar}
          alt="calendar"
          width={24}
          height={24}
          className={`mr-2 ${iconColor}`}
        />
        <Typography
          as="span"
          type="body"
          className={`font-onest text-[12px] leading-none font-light ${isExpired ? 'text-gray-400' : 'text-muted'}`}
        >
          {formatDate(ticket.ticket_start_date, 'date')}
        </Typography>
      </Box>
    </Box>
  );
}
