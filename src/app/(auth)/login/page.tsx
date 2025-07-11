import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';

const LoginForm = dynamic(() => import('@/components/auth/login/login-form'));

export default function LoginPage() {
  return (
    <Box className="mx-auto mt-32 max-w-xs text-white xl:mr-0 xl:ml-47">
      <Box className="mb-20 text-center">
        <Typography className="mb-4">Welcome to Wukong,</Typography>
        <Typography size={41} type="heading" className="font-normal uppercase">
          {'Log in to your account'.split('').map((child, idx) => (
            <span className="hover-text" key={idx}>
              {child}
            </span>
          ))}
        </Typography>
      </Box>

      {/* Form */}
      <LoginForm />

      {/* Links */}
      <Box className="mt-16 flex flex-col items-center md:flex-row md:justify-between">
        <Typography size={12}>
          <a
            id="forgot_password_link"
            href="/forgot-password"
            className="hover:text-green underline"
          >
            Forgot Your Password?
          </a>
        </Typography>

        <Box className="mt-7 md:mt-0">
          <Typography size={12}>
            Need an account?{' '}
            <a
              id="sign_up_link"
              href="/register"
              className="hover:text-green underline"
            >
              Sign up
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
