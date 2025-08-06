'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from '@/lib/api/axios-client';
import { FormProvider, useForm } from 'react-hook-form';
import { email } from '@/utils/form-validation';
import { getErrorMessage } from '@/lib/api/error-handler';
import { useAuth } from '@/lib/session/use-auth';
import { Button, TextField, Typography } from '@/components';
import eyeClosed from '@/assets/icons/eye-closed.svg';
import eyeOpened from '@/assets/icons/eye-open.svg';
import Loading from '@/components/layout/loading';
import { getSessionStorage, setSessionStorage } from '@/lib/browser-storage';

interface FormDataLogin {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const pathname = usePathname();
  const destination: string = getSessionStorage('destination') ?? '';

  // Initialize state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = useForm<FormDataLogin>({});

  const onSubmit = async (formData: FormDataLogin) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);

      if (response.status === 200) {
        await checkAuth(); // Refresh auth state

        // handle redirect based on current path
        if (pathname === '/ticket/auth') {
          router.replace('/ticket/scanner');
        } else {
          const redirectPath = destination || '/';
          setSessionStorage('destination', '');
          router.replace(redirectPath);
        }
      }
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading */}
      {loading && <Loading />}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
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

          <Button id="login_button" type="submit">
            Log In
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
