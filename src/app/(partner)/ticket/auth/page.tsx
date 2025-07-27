import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Box, Typography } from '@/components';
import logo from '@/assets/logo/white-logo.svg';

const LoginForm = dynamic(() => import('@/components/auth/login/form'));

export default function TicketScanner() {
  return (
    <Box className="relative min-h-screen flex items-center justify-center bg-black text-white">
      <Image
        src={logo}
        alt="Logo"
        height={32}
        width={120}
        className="absolute top-6 left-6 h-8 w-auto"
        priority
      />

      <Box className="w-full max-w-sm px-4">
        <Box className="mb-8 text-center">
          <Typography className="mb-4">Hi partner 👋</Typography>
          <Typography
            size={41}
            type="heading"
            className="font-normal uppercase"
          >
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
  );
}
