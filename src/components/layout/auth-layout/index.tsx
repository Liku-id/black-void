import { ReactNode } from 'react';
import Image from 'next/image';
import backgroundImage from '@/assets/image/auth-background.svg';
import logo from '@/assets/logo/white-logo.svg';
import { Box, Typography } from '@/components';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box className="w-screen h-screen flex items-center justify-center overflow-hidden">
      <Box className="relative w-full max-w-[1440px] h-full 2xl:h-[810px] flex">
        {/* Left Side - Background*/}
        <Box className="relative w-1/2 hidden md:block">
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
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            priority
          />
        </Box>

        {/* Center Stripe Vertical Text */}
        <Box className="w-[80px] bg-white border border-black overflow-hidden lg:flex justify-center hidden">
          <Box className="flex transform -rotate-90">
            <Box className="flex justify-start origin-bottom w-full">
              {["Let's collaborate", "Let's create", "Let's connect"].map(
                (txt, idx) => (
                  <Box key={idx} className="flex items-center">
                    <Box className="w-4 h-4 rounded-full border border-black mx-8" />
                    <Typography
                      size={40}
                      type="heading"
                      className="font-normal whitespace-nowrap"
                    >
                      {txt}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Side - Content */}
        <Box className="w-full md:w-1/2">{children}</Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
