'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';
import SafariWarningModal from '@/components/scanner/safari-warning-modal';

const LoginForm = dynamic(() => import('@/components/auth/login/form'));

const isSafari = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const vendor = window.navigator.vendor?.toLowerCase() || '';
  
  const isSafariBrowser = 
    vendor.includes('apple') &&
    userAgent.includes('safari') &&
    !userAgent.includes('chrome') &&
    !userAgent.includes('chromium') &&
    !userAgent.includes('edg') &&
    !userAgent.includes('firefox') &&
    !userAgent.includes('opera');
  
  return isSafariBrowser;
};

export default function TicketScanner() {
  const [showSafariWarning, setShowSafariWarning] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);

  useEffect(() => {
    const safariDetected = isSafari();
    setIsSafariBrowser(safariDetected);
    if (safariDetected) {
      setShowSafariWarning(true);
    }
  }, []);

  return (
    <>
      <Box className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-black text-white">
        <Box className="w-full max-w-sm px-4">
          <Box className="mb-8 text-center">
            <Typography className="mb-4">Hi partner 👋</Typography>
            <Typography
              size={41}
              type="heading"
              className="font-normal uppercase">
              {'Ready to Scan?'.split('').map((child, idx) => (
                <span className="hover-text" key={idx}>
                  {child}
                </span>
              ))}
            </Typography>
          </Box>
          <LoginForm />
        </Box>
      </Box>
      {isSafariBrowser && (
        <SafariWarningModal
          open={showSafariWarning}
          onClose={() => setShowSafariWarning(false)}
        />
      )}
    </>
  );
}
