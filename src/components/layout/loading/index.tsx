'use client';

import Image from 'next/image';
import { Box } from '@/components';
import { cn } from '@/utils/utils';
import loadingIcon from '@/assets/icons/loading.svg';

export default function Loading({
  className,
  isFullPage = true,
}: {
  className?: string;
  isFullPage?: boolean;
}) {
  return (
    <Box
      data-testid="loading"
      className={cn(
        isFullPage
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50'
          : 'flex items-center justify-center',
        className
      )}>
      <Image
        src={loadingIcon}
        alt="Loading..."
        width={99}
        height={99}
        className="2s linear infinite animate-spin"
        priority
      />
    </Box>
  );
}
