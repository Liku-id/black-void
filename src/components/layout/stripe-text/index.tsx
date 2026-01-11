'use client';

import React from 'react';
import { Box, Typography } from '@/components';
import { cn } from '@/utils/utils';

interface StripeTextProps {
  direction?: 'vertical' | 'horizontal';
  scrollDirection?:
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left-to-right'
  | 'right-to-left';
  texts?: string[];
  className?: string;
}

/**
 * @example
 * // StripeText horizontal
 * <StripeText direction="horizontal" scrollDirection='right-to-left' texts={["Let's collaborate",..]} />
 *
 * @example
 * // StripeText horizontal
 * <StripeText direction="vertical"/>
 */

export default function StripeText({
  direction = 'vertical',
  scrollDirection = direction === 'vertical'
    ? 'bottom-to-top'
    : 'right-to-left',
  texts = ["Let's collaborate", "Let's create", "Let's connect"],
  className = '',
}: StripeTextProps) {
  const isVertical = direction === 'vertical';

  const animationClass = cn({
    'animate-scroll-vertical-down': scrollDirection === 'top-to-bottom',
    'animate-scroll-vertical-up': scrollDirection === 'bottom-to-top',
    'animate-scroll-horizontal-left': scrollDirection === 'right-to-left',
    'animate-scroll-horizontal-right': scrollDirection === 'left-to-right',
  });
  return (
    <Box
      className={cn(
        'h-full overflow-hidden border-black bg-white',
        isVertical ? 'border-x' : 'border-y',
        className
      )}>
      <Box
        className={cn(
          'flex',
          isVertical ? 'flex-col' : 'gap-8 overflow-hidden'
        )}>
        {[1, 2].map((_, idx) => (
          <Box
            key={`wrap-stripe-${idx}`}
            aria-hidden={idx === 1}
            className={cn(
              'flex justify-between',
              isVertical
                ? 'flex-col-reverse px-2.5'
                : 'min-w-full flex-shrink-0 items-center gap-8 py-2 whitespace-nowrap',
              animationClass
            )}>
            {texts.map((txt, idx) => (
              <Box
                key={`stripe-${idx}`}
                className={cn(
                  'flex items-center',
                  isVertical ? 'flex-col' : ''
                )}>
                {!isVertical && (
                  <Box className="mr-8 h-4 w-4 rounded-full border border-black" />
                )}
                <Typography
                  size={40}
                  type="heading"
                  color="text-black"
                  className={cn(
                    'font-normal',
                    isVertical
                      ? 'rotate-180 [writing-mode:vertical-rl]'
                      : 'whitespace-nowrap'
                  )}>
                  {txt}
                </Typography>

                {isVertical && (
                  <Box className="my-8 h-4 w-4 rounded-full border border-black" />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
