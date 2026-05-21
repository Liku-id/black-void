import dynamic from 'next/dynamic';
import { Box, Typography } from '@/components';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ForgotPasswordForm = dynamic(
  () => import('@/components/auth/forgot-password/form')
);

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword');

  return (
    <main>
      <Box className="mx-auto mt-24 mb-10 max-w-sm text-white md:mt-32">
        <Box className="mb-8 text-center md:mb-20">
          <Typography
            size={41}
            type="heading"
            className="mb-4 font-normal uppercase leading-tight"
            dangerouslySetInnerHTML={{ __html: t('title') }}
          />
          <Typography size={16} type="body">
            {t('desc')}
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
