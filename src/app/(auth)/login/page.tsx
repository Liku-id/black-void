import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';
import Link from 'next/link';

const LoginForm = dynamic(() => import('@/components/auth/login/form'));

export default function LoginPage() {
  return (
    <Box className="mx-auto mt-24 mb-10 max-w-sm text-white md:mt-32">
      <Box className="mb-8 text-center md:mb-20">
        <Typography size={41} type="heading" className="font-normal uppercase">
          {'are Wu in?'.split('').map((child, idx) => (
            <span className="hover-text" key={idx}>
              {child}
            </span>
          ))}
        </Typography>
        <Typography className="mb-4">It takes a little more to find the chosen Wu!</Typography>
      </Box>

      {/* Form */}
      <LoginForm />

      {/* Links */}
      <Box className="mt-16 flex flex-col items-center md:flex-row md:justify-between">
        <Typography size={12}>
          <Link
            id="forgot_password_link"
            href="/forgot-password"
            className="hover:text-green underline">
            Forgot Your Password?
          </Link>
        </Typography>

        <Box className="mt-7 md:mt-0">
          <Typography size={12}>
            Need an account?{' '}
            <Link
              id="btn_rgs_signup"
              href="/register"
              className="hover:text-green underline">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
