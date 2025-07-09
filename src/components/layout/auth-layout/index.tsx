import { ReactNode } from 'react';
import Image from 'next/image';
import backgroundImage from '@/assets/image/auth-background.svg';
import logo from '@/assets/logo/white-logo.svg';
import { Box } from '@/components';
import StripeText from '@/components/layout/stripe-text';

type AuthLayoutProps = {
  children?: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <Box className="relative flex h-full w-full max-w-[1440px] 2xl:h-[810px]">
        {/* Left Side - Background*/}
        <Box className="relative hidden w-1/2 lg:block">
          <Image
            src={backgroundImage}
            alt="Wukong - Event Ticketing Platform Login and Registration Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <Image
            src={logo}
            alt="Logo"
            width={320}
            height={110}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
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
