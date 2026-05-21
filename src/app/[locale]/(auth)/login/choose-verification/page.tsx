import { Box, Typography } from '@/components';
import dynamic from 'next/dynamic';

const ChooseVerificationForm = dynamic(
  () => import('@/components/auth/verify-otp/choose-verification-form'),
);

export default function LoginChooseVerificationPage() {
  return (
    <Box className="relative mx-auto mt-32 max-w-[370px] text-white xl:mr-0 xl:ml-30">
      <Box className="text-center">
        <Typography size={41} type="heading" className="font-normal uppercase">
          {"let's get wu verified".split('').map((child, idx) => (
            <span className="hover-text" key={idx}>
              {child}
            </span>
          ))}
        </Typography>
      </Box>

      <Box className="mt-8 text-center">
        <Typography size={14}>Choose Wu method to verify Wu account</Typography>
      </Box>

      {/* Form */}
      <ChooseVerificationForm />
    </Box>
  );
}
