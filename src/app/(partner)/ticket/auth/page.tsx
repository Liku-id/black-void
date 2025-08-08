import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';

const LoginForm = dynamic(() => import('@/components/auth/login/form'));

export default function TicketScanner() {
  return (
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
  );
}
