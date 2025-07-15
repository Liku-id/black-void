'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextField, Typography, Box } from '@/components';
import Loading from '@/components/layout/loading';
import EyeClosed from '@/assets/icons/eye-closed.svg';
import EyeOpened from '@/assets/icons/eye-open.svg';
import Checkbox from '@/components/common/checkbox';
import ErrorIcon from '@/assets/icons/error.svg';
import SuccessIcon from '@/assets/icons/success.svg';
import Image from 'next/image';
import SuccessModal from './success-modal';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  // Get token & email from query string
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Initialize state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const methods = useForm<ResetPasswordData>({ mode: 'onChange' });
  // Password validation logic
  const passwordValue = methods.watch('password', '');
  const confirmPasswordValue = methods.watch('confirmPassword', '');
  const passwordChecks = useMemo(
    () => ({
      length: passwordValue.length >= 8 && passwordValue.length <= 12,
      number: /[0-9]/.test(passwordValue),
      special: /[^A-Za-z0-9]/.test(passwordValue),
      capital: /[A-Z]/.test(passwordValue),
    }),
    [passwordValue]
  );

  const allValid =
    Object.values(passwordChecks).every(Boolean) &&
    passwordValue === confirmPasswordValue &&
    passwordValue.length > 0;

  const showErrorIcon =
    confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;
  const showSuccessIcon =
    confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;

  const onSubmit = async (formData: ResetPasswordData) => {
    setError('');
    setLoading(true);
    try {
      // Implementasi API call
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          token,
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unknown error');
      // Jika sukses, tampilkan modal
      setModalOpen(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    if (!token || !email) {
      router.replace('/forgot-password');
    }
  }, [token, email, router]);

  return (
    <>
      {/* Loading overlay */}
      {loading && <Loading />}

      <FormProvider {...methods}>
        <form
          data-testid="reset-password-form"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <TextField
            id="password_field"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="mb-7 w-[270px]"
            rules={{ required: 'Password is required' }}
            endIcon={showPassword ? EyeOpened : EyeClosed}
            onEndIconClick={() => setShowPassword(!showPassword)}
          />

          <Box className="relative mb-10">
            <TextField
              id="confirm_password_field"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-[270px]"
              rules={{
                required: 'Confirm password is required',
                validate: (value: string) =>
                  value === passwordValue || 'Password does not match',
              }}
              endIcon={showConfirmPassword ? EyeOpened : EyeClosed}
              onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            {/* Error/success icon absolute at the right of the input */}
            {confirmPasswordValue.length > 0 && (
              <span className="absolute right-[-32px] top-3 flex items-center">
                {showErrorIcon && (
                  <Image src={ErrorIcon} alt="Error" width={22} height={22} />
                )}
                {showSuccessIcon && (
                  <Image src={SuccessIcon} alt="Success" width={22} height={22} />
                )}
              </span>
            )}
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mb-10">
            <Checkbox checked={passwordChecks.length} disabled>
              <Typography type="body" size={14}>
                8-12 Character
              </Typography>
            </Checkbox>
            <Checkbox checked={passwordChecks.number} disabled>
              <Typography type="body" size={14}>
                Number
              </Typography>
            </Checkbox>
            <Checkbox checked={passwordChecks.special} disabled>
              <Typography type="body" size={14}>
                Special Character
              </Typography>
            </Checkbox>
            <Checkbox checked={passwordChecks.capital} disabled>
              <Typography type="body" size={14}>
                Capital Letters
              </Typography>
            </Checkbox>
          </Box>

          <Button
            id="reset_password_button"
            type="submit"
            disabled={!allValid || loading}
          >
            Reset Password
          </Button>

          {error && (
            <Typography size={12} className="text-danger mt-2">
              {error}
            </Typography>
          )}
        </form>
      </FormProvider>

      <SuccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ResetPasswordForm;
