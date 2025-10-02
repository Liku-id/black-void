'use client';
import Image from 'next/image';
import { Box, Typography } from '@/components';
import locationPin from '@/assets/icons/location-pin.svg';
import calendar from '@/assets/icons/calendar.svg';
import { useRouter } from 'next/navigation';

interface TicketData {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'ongoing' | 'expired';
  eventId: string;
}

interface TicketCardProps {
  ticket: TicketData;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();

  const isExpired = ticket.status === 'expired';
  const textColor = isExpired ? 'text-gray-400' : 'text-black';
  const iconColor = isExpired ? 'grayscale' : '';

  const handleCardClick = () => {
    router.push(`/transaction/${ticket.id}/tickets`);
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
        {ticket.title}
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
          {ticket.location}
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
          {ticket.date}
        </Typography>
      </Box>
    </Box>
  );
}
