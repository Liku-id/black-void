'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@/components';
import Image from 'next/image';
import CloseIcon from '@/assets/icons/close.svg';
import { Typography } from '@/components/common/typography';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const Modal = ({
  open,
  onClose,
  title,
  footer,
  children,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return ReactDOM.createPortal(
    <Box className="fixed inset-0 z-50 flex items-center justify-center">
      <Box
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.5)' }}
      />
      <Box className="relative mx-4 flex w-full max-w-none flex-col items-stretch justify-center border border-white bg-black shadow-[4px_4px_0px_0px_#FFF] md:w-[431px]">
        <Box className="flex items-center justify-between p-4 pb-4 md:p-8 md:pb-6">
          {title && (
            <Typography as="h2" type="heading" size={32} className="text-white">
              {title}
            </Typography>
          )}
          <Box onClick={onClose} className="mb-4 cursor-pointer">
            <Image src={CloseIcon} alt="Close" width={24} height={24} />
          </Box>
        </Box>
        {children && <Box className="px-4 md:px-8">{children}</Box>}
        {footer && (
          <Box className="flex justify-end px-4 pb-4 md:justify-start md:px-8 md:pb-8">
            {footer}
          </Box>
        )}
      </Box>
    </Box>,
    document.body
  );
};
