'use client';

import { useState, useMemo, Suspense } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextField, Typography, Box, Checkbox } from '@/components';
import Loading from '@/components/layout/loading';
import EyeClosed from '@/assets/icons/eye-closed.svg';
import EyeOpened from '@/assets/icons/eye-open.svg';
import ErrorIcon from '@/assets/icons/error.svg';
import SuccessIcon from '@/assets/icons/success.svg';
import Image from 'next/image';
import SuccessModal from './success-modal';
import axios from 'axios';
import { getErrorMessage } from '@/lib/api/error-handler';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
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
      const res = await axios.post('/api/auth/reset-password', {
        password: formData.password,
      });
      const data = res.data;
      if (res.status !== 200) throw new Error(data.message || 'Unknown error');
      setModalOpen(true);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense>
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
              onEndIconClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
            {/* Error/success icon absolute at the right of the input */}
            {confirmPasswordValue.length > 0 && (
              <span className="absolute top-3 right-[-32px] flex items-center">
                {showErrorIcon && (
                  <Image src={ErrorIcon} alt="Error" width={22} height={22} />
                )}
                {showSuccessIcon && (
                  <Image
                    src={SuccessIcon}
                    alt="Success"
                    width={22}
                    height={22}
                  />
                )}
              </span>
            )}
          </Box>

          <Box className="mb-10 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
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

      <SuccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Suspense>
  );
};

export default ResetPasswordForm;
