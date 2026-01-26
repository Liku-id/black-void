import { Box, Typography } from '@/components';
import Image from 'next/image';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';

import React from 'react';

interface AccordionProps {
  id?: string;
  question: string;
  answer: React.ReactNode | string;
  className?: string;
  open?: boolean;
  onClick?: () => void;
}

export default function Accordion({
  id,
  question,
  answer,
  className,
  open = false,
  onClick,
}: AccordionProps) {
  return (
    <Box className={className + ' relative z-10'}>
      {/* Offset Layer */}
      <Box
        className={[
          'absolute',
          'z-0',
          'w-full',
          'h-full',
          'border',
          'border-black',
          'bg-white',
          'transition-all',
          'duration-300',
          open ? 'top-1 left-1 opacity-100' : 'top-0 left-0 opacity-0',
        ].join(' ')}>
        {null}
      </Box>
      <Box
        id={id}
        className={[
          'relative',
          'border',
          'border-black',
          'bg-white',
          'p-4',
          'cursor-pointer',
          'transition-all',
          'duration-300',
          'overflow-hidden',
        ].join(' ')}
        onClick={onClick}>
        <Box className="flex items-center justify-between">
          <Typography type="body" size={16} color="text-black">
            {question}
          </Typography>
          <Image
            src={accordionArrow}
            alt="Toggle FAQ"
            width={24}
            height={24}
            className={`ml-4 h-6 w-6 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </Box>
        <Box
          className={[
            'transition-all',
            'duration-300',
            'ease-in-out',
            'overflow-hidden',
            open ? 'mt-3 ml-3 max-h-40 opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}>
          <Typography as="div" color="text-muted" size={14} className="whitespace-pre-line">
            {answer}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
