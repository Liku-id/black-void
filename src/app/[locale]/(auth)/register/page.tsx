import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const RegisterForm = dynamic(
  () => import('@/components/auth/register/register-form')
);

export default function RegisterPage() {
  const t = useTranslations('register');

  return (
    <Box className="relative mx-auto mt-32 max-w-[360px] text-white xl:mr-0 xl:ml-47">
      <Box className="mb-8 text-center">
        <Typography className="mb-3">Lets get Wu in!</Typography>
        <Typography size={41} type="heading" className="font-normal uppercase">
          {'tell us about wu'.split('').map((child, idx) => (
            <span className="hover-text" key={idx}>
              {child}
            </span>
          ))}
        </Typography>
      </Box>

      {/* Form */}
      <RegisterForm />

      {/* Links */}
      <Box className="mt-16 flex flex-col items-center md:flex-row md:justify-between">
        <Typography size={12}>
          <Link
            id="forgot_password_link"
            href="/forgot-password"
            className="hover:text-green underline">
            {t('forgot_password')}
          </Link>
        </Typography>

        <Box className="mt-7 md:mt-0">
          <Typography size={12}>
            {t.rich('already_account', {
              link: (chunks) => (
                <Link
                  id="btn_rgs_login"
                  href="/login"
                  className="hover:text-green underline">
                  {chunks}
                </Link>
              )
            })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
