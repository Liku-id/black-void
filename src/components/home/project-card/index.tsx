'use client';
import Image from 'next/image';
import { Box, Typography, Button } from '@/components';
import locationIcon from '@/assets/icons/location.svg';
import calendarIcon from '@/assets/icons/calendar.svg';

interface ProjectCardProps {
  image: string;
  title: string;
  location: string;
  date: string;
  price: string;
}

export default function ProjectCard({
  image,
  title,
  location,
  date,
  price,
}: ProjectCardProps) {
  return (
    <Box className="h-auto w-[270px] cursor-pointer border border-black bg-white p-0 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[6px_6px_0px_0px_#FFF]">
      <img
        src={image}
        alt={title}
        className="h-[152px] w-full object-cover"
        onError={e => {
          console.log('Image failed to load:', image);
          e.currentTarget.src =
            'https://dummyimage.com/270x152/CCCCCC/666666.png&text=Image+Error';
        }}
        onLoad={() => console.log('Image loaded successfully:', image)}
      />
      <Box className="p-4">
        <Typography
          type="heading"
          size={26}
          color="text-black"
          className="mb-3 truncate">
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
          <Button className="bg-green px-2 py-1 text-white">Buy Ticket</Button>
        </Box>
      </Box>
    </Box>
  );
}
