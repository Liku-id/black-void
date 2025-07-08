import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';

const LoginForm = dynamic(() => import('@/components/auth/login/login-form'));

export default function LoginPage() {
  return (
    <Box className="max-w-xs text-white mt-32 mx-auto xl:ml-37 xl:mr-0">
      <Box className="text-center mb-20">
        <Typography className="mb-4">Welcome to Wukong,</Typography>
        <Typography size={41} type="heading" className="uppercase font-normal">
          Log in to your account
        </Typography>
      </Box>

      {/* Form */}
      <LoginForm />

      {/* Links */}
      <Box className="flex flex-col items-center mt-16 md:justify-between md:flex-row">
        <Typography size={12}>
          <a href="/forgot-password" className="underline hover:text-green">
            Forgot Your Password?
          </a>
        </Typography>

        <Box className="mt-7 md:mt-0">
          <Typography size={12}>
            Need an account?{' '}
            <a href="/register" className="underline hover:text-green">
              Sign up
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
