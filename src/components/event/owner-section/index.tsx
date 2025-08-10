import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@/components';

interface OwnerSectionProps {
  eventOrganizer: any;
  termAndConditions: string;
}

const OwnerSection: React.FC<OwnerSectionProps> = ({
  eventOrganizer,
  termAndConditions,
}) => {
  const [showFull, setShowFull] = useState(false);
  const maxChar = 300;
  const isLong = termAndConditions.length > maxChar;

  return (
    <>
      <Typography
        type="heading"
        size={22}
        color="text-white"
        className="leading-none"
      >
        Terms & Conditions
      </Typography>
      <Typography
        type="body"
        size={12}
        className="my-3 max-h-[120px] overflow-hidden text-white"
      >
        {showFull
          ? termAndConditions
          : termAndConditions.slice(0, maxChar) + (isLong ? '...' : '')}
      </Typography>
      {isLong && (
        <button
          className="mt-1 text-xs text-blue-500 underline"
          onClick={() => setShowFull(!showFull)}
          type="button"
        >
          {!showFull ? 'See details' : 'Show less'}
        </button>
      )}

      <Typography
        type="heading"
        size={22}
        color="text-white"
        className="mt-8 mb-3 lg:mt-10"
      >
        Promotor Info
      </Typography>
      <Box className="flex items-center gap-3">
        <Box className="mr-4 flex h-12 w-12 items-center rounded-[14px] bg-white">
          {eventOrganizer?.asset?.url ? (
            <Image
              src={eventOrganizer?.asset?.url}
              alt="Owner Logo"
              width={48}
              height={48}
              objectFit="contain"
              unoptimized
            />
          ) : (
            <Box className="mr-4 h-12 w-12 rounded-[14px] bg-white" />
          )}
        </Box>
        <Typography
          type="body"
          size={14}
          color="text-white"
          className="font-bold"
        >
          {eventOrganizer.name}
        </Typography>
      </Box>
    </>
  );
};

export default OwnerSection;
