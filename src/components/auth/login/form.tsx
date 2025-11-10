'use client';

import eyeClosed from '@/assets/icons/eye-closed.svg';
import eyeOpened from '@/assets/icons/eye-open.svg';
import { Button, TextField, Typography } from '@/components';
import SnackBar from '@/components/common/snack-bar';
import Loading from '@/components/layout/loading';
import axios from '@/lib/api/axios-client';
import { getErrorMessage } from '@/lib/api/error-handler';
import { getSessionStorage, setSessionStorage } from '@/lib/browser-storage';
import { trackEvent, trackLogin } from '@/lib/posthog';
import { useAuth } from '@/lib/session/use-auth';
import { authAtom } from '@/store';
import { email } from '@/utils/form-validation';
import { useSnackBar } from '@/utils/use-snack-bar';
import { AxiosError } from 'axios';
import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import UnverifiedModal from './unverified-modal';

interface FormDataLogin {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { setAuthUser } = useAuth();
  const [, setAuth] = useAtom(authAtom);
  const pathname = usePathname();
  const destination: string = getSessionStorage('destination') ?? '';
  const { snackState, hideSnack, showError } = useSnackBar();

  // Initialize state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);

  const methods = useForm<FormDataLogin>({});

  const onSubmit = async (formData: FormDataLogin) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        origin: pathname,
        form: formData,
      });

      if (response.status === 200) {
        setAuthUser(response.data.data);

        // Track successful login
        trackLogin(
          response.data.data.id || 'unknown',
          response.data.data.name,
          response.data.data.email
        );

        // handle redirect based on current path
        if (pathname === '/ticket/auth') {
          router.replace('/ticket/scanner');
        } else {
          const redirectPath = destination || '/';
          setSessionStorage('destination', '');
          setSessionStorage('isExpiry', '');
          router.replace(redirectPath);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError?.response?.status;
      const responseData = axiosError?.response?.data?.data;
      
      // Check if user is not verified (403 status)
      if (status === 403 && responseData) {
        // Store unverified user data in authAtom for use in verification flow
        setAuth({
          isLoggedIn: false,
          userData: {
            email: responseData.email,
            phoneNumber: responseData.phone_number,
            isVerified: false,
          } as any,
          loading: false,
        });
        
        setShowUnverifiedModal(true);
        return; // Exit early to avoid showing error message
      }

      console.error(error);
      setError(getErrorMessage(error));

      // Track failed login attempt
      trackEvent('login_failed', {
        error: getErrorMessage(error),
        email: formData.email,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isExpiry = getSessionStorage('isExpiry');
    if (isExpiry) {
      showError('Session has expired. Please log in again to continue.');
      setSessionStorage('isExpiry', '');
    }
  }, [showError]);

  const handleVerifyAccount = () => {
    router.push('/login/choose-verification');
  };

  return (
    <>
      {/* Loading */}
      {loading && <Loading />}

      {/* Unverified Account Modal */}
      <UnverifiedModal
        open={showUnverifiedModal}
        onVerify={handleVerifyAccount}
      />

      {/* Expiry message */}
      <SnackBar
        show={snackState.show}
        onHide={hideSnack}
        text={snackState.text}
        variant={snackState.variant}
        autoHideDelay={5000}
        position="top"
      />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col items-center">
          <TextField
            id="email_field"
            name="email"
            type="email"
            placeholder="Email Address"
            className="mb-4 w-[270px] md:mb-7"
            rules={{ required: 'Email is required', validate: email }}
          />

          <TextField
            id="password_field"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="mb-10 w-[270px]"
            rules={{ required: 'Password is required' }}
            endIcon={showPassword ? eyeOpened : eyeClosed}
            onEndIconClick={() => setShowPassword(!showPassword)}
          />

          <Button id="btn_li_login" type="submit">
            Get In
          </Button>

          {error && (
            <Typography size={12} className="text-danger mt-2">
              {error}
            </Typography>
          )}
        </form>
      </FormProvider>
    </>
  );
};

export default LoginForm;
