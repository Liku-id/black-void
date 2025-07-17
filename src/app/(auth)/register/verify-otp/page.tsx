import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';

const VerifyOtpForm = dynamic(
  () => import('@/components/auth/verify-otp/verify-otp-form')
);

export default function VerifyOtpPage() {
  return (
    <Box className="relative mx-auto mt-32 max-w-[370px] text-white xl:mr-0 xl:ml-30">
      <Box className="text-center">
        <Typography size={41} type="heading" className="font-normal uppercase">
          {'phone number verification'.split('').map((child, idx) => (
            <span className="hover-text" key={idx}>
              {child}
            </span>
          ))}
        </Typography>
      </Box>

      {/* Form */}
      <VerifyOtpForm />
    </Box>
  );
}
