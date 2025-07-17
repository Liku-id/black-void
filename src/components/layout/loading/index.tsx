'use client';

import Image from 'next/image';
import { Box } from '@/components';
import { cn } from '@/utils/utils';
import loadingIcon from '@/assets/icons/loading.svg';

export default function Loading({ className }: { className?: string }) {
  return (
    <Box
      data-testid="loading"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
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
