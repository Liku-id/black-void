'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/logo/white-logo.svg';
import { Box } from '@/components';
import StripeText from '@/components/layout/stripe-text';

type AuthLayoutProps = {
  children?: ReactNode;
};

const backgrounds = [
  'https://wukong-staging-public.s3.ap-southeast-3.amazonaws.com/assets/WEB/auth-background-1.jpg',
  'https://wukong-staging-public.s3.ap-southeast-3.amazonaws.com/assets/WEB/auth-background-2.jpg',
  'https://wukong-staging-public.s3.ap-southeast-3.amazonaws.com/assets/WEB/auth-background-3.jpg',
  'https://wukong-staging-public.s3.ap-southeast-3.amazonaws.com/assets/WEB/auth-background-4.jpg',
  'https://wukong-staging-public.s3.ap-southeast-3.amazonaws.com/assets/WEB/auth-background-5.jpg',
];

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgrounds.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <Box className="relative flex h-full w-full max-w-[1440px] 2xl:h-[810px]">
        {/* Left Side - Background */}
        <Box className="relative hidden w-1/2 overflow-hidden lg:block">
          {/* Backgrounds stacked on top of each other */}
          {backgrounds.map((bg, index) => (
            <Image
              key={index}
              src={bg}
              alt={`Background ${index + 1}`}
              fill
              sizes="100vw"
              style={{
                objectFit: 'cover',
                opacity: index === currentIndex ? 1 : 0,
                zIndex: index === currentIndex ? 1 : 0,
              }}
              className="absolute inset-0"
              priority={index === 0}
            />
          ))}

          {/* Centered Logo */}
          <Image
            src={logo}
            alt="Logo"
            width={320}
            height={110}
            className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform"
            priority
          />
        </Box>

        {/* Center Stripe Vertical Text */}
        <StripeText direction="vertical" className="hidden h-[810px] lg:flex" />

        {/* Right Side - Content */}
        <Box className="w-full lg:w-1/2">{children}</Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
