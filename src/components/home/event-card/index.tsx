'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@/components';
import locationIcon from '@/assets/icons/location.svg';
import calendarIcon from '@/assets/icons/calendar.svg';

interface EventCardProps {
  metaUrl?: string;
  image?: string;
  title?: string;
  location?: string;
  date?: string;
  price?: string;
  skeleton?: boolean;
}

export default function EventCard({
  metaUrl,
  image,
  title,
  location,
  date,
  price,
  skeleton = false,
}: EventCardProps) {
  const router = useRouter();
  if (skeleton) {
    return (
      <Box className="h-auto w-[270px] animate-pulse border border-black bg-white p-0 shadow-sm">
        <Box className="h-[152px] w-full bg-gray-300" />
        <Box className="p-4">
          <Box className="mb-3 h-6 w-3/4 bg-gray-200" />
          <Box className="mb-3 flex items-center">
            <Box className="mr-2 h-6 w-6 bg-gray-200" />
            <Box className="h-4 w-1/2 bg-gray-100" />
          </Box>
          <Box className="flex items-center">
            <Box className="mr-2 h-6 w-6 bg-gray-200" />
            <Box className="h-4 w-1/2 bg-gray-100" />
          </Box>
        </Box>
        <Box className="px-[10px] py-[12px]">
          <Box className="flex items-center justify-between">
            <Box className="h-6 w-1/4 bg-gray-200" />
            <Box className="h-8 w-16 bg-gray-300" />
          </Box>
        </Box>
      </Box>
    );
  }
  return (
    <Box className="h-auto w-[270px] border border-black bg-white p-0 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[6px_6px_0px_0px_#FFF]">
      {image ? (
        <Image
          src={
            image ||
            'https://dummyimage.com/270x152/CCCCCC/666666.png&text=No+Image'
          }
          alt={title || 'Event image'}
          width={270}
          height={152}
          className="h-[152px] w-full object-cover"
          unoptimized
        />
      ) : (
        <Box className="flex h-[152px] w-full items-center justify-center bg-gray-200 text-xs text-gray-500">
          No Image
        </Box>
      )}
      <Box className="p-4">
        <Typography
          type="heading"
          size={26}
          color="text-black"
          className="mb-3 truncate leading-none">
          {title}
        </Typography>
        <Box className="mb-3 flex items-center">
          <Image
            src={locationIcon}
            alt="location"
            width={24}
            height={24}
            className="mr-2"
          />
          <Typography
            as="span"
            type="body"
            className="font-onest text-[12px] leading-none font-light"
            color="text-muted">
            {location}
          </Typography>
        </Box>
        <Box className="flex items-center">
          <Image
            src={calendarIcon}
            alt="calendar"
            width={24}
            height={24}
            className="mr-2"
          />
          <Typography
            as="span"
            type="body"
            className="font-onest text-[12px] leading-none font-light"
            color="text-muted">
            {date}
          </Typography>
        </Box>
      </Box>
      <Box className="px-[10px] py-[12px]">
        <Box className="flex items-center justify-between">
          <Typography
            type="heading"
            size={22}
            color="text-black"
            className="font-bebas leading-none">
            {price}
          </Typography>
          <Button
            id={`${metaUrl}_buy_ticket_button`}
            className="bg-green px-2 py-1 text-white"
            onClick={() => router.push(`/event/${metaUrl}`)}>
            Buy Ticket
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
