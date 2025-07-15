import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';

const ResetPasswordForm = dynamic(
  () => import('@/components/auth/reset-password/form')
);

export default function ResetPasswordPage() {
  return (
    <Box className="mx-auto mt-24 mb-10 max-w-sm text-white md:mt-32">
      <Box className="mb-6 text-center">
        <Typography className="mb-2 md:mb-4">Welcome Back!</Typography>
        <Typography size={41} type="heading" className="font-normal uppercase">
          Change your password
        </Typography>
      </Box>

      {/* Form */}
      <ResetPasswordForm />
    </Box>
  );
}
