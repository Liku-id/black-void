import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';
import Link from 'next/link';

const ForgotPasswordForm = dynamic(
  () => import('@/components/auth/forgot-password/form')
);

export default function ForgotPasswordPage() {
  return (
    <main>
      <Box className="mx-auto mt-24 mb-10 max-w-sm text-white md:mt-32">
        <Box className="mb-8 text-center md:mb-20">
          <Typography
            size={41}
            type="heading"
            className="mb-4 font-normal uppercase">
            Trouble logging in?
          </Typography>
          <Typography size={16} type="body">
            Enter your registered email below to receive password reset
            instructions
          </Typography>
        </Box>

        {/* Form */}
        <ForgotPasswordForm />

        {/* Links */}
        <Box className="mt-14 text-center md:mt-20">
          <Typography size={12}>
            <Link
              id="forgot_password_link"
              href="/login"
              className="hover:text-green underline">
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
