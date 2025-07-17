'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { email, usePasswordValidation } from '@/utils/form-validation';
import { getErrorMessage } from '@/lib/api/error-handler';
import { useAtom } from 'jotai';
import { registerFormAtom, RegisterFormData } from '@/store/atoms/auth';
import { Box, Button, TextField, Typography, Checkbox } from '@/components';
import eyeClosed from '@/assets/icons/eye-closed.svg';
import eyeOpened from '@/assets/icons/eye-open.svg';
import Loading from '@/components/layout/loading';
import errorIcon from '@/assets/icons/error.svg';
import SuccessIcon from '@/assets/icons/success.svg';

const RegisterForm = () => {
  const router = useRouter();

  // Initialize state
  const [agree, setAgree] = useState(false);
  const [countryCode, setCountryCode] = useState('+62');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setPaylod] = useAtom(registerFormAtom);

  const methods = useForm<RegisterFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { trigger, getValues, handleSubmit, watch } = methods;

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isPasswordMatch = password === confirmPassword;
  const passwordChecks = usePasswordValidation(password);
  const allValid =
    Object.values(passwordChecks).every(Boolean) && isPasswordMatch && agree;

  const onSubmit = async (formData: RegisterFormData) => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        phoneNumber: `${countryCode}${formData.phoneNumber.trim()}`,
      };

      // Set payload to global state
      setPaylod(payload);

      const response = await axios.post('/api/auth/request-otp', {
        phoneNumber: payload.phoneNumber,
      });

      if (response.status === 200) {
        router.replace('/register/verify-otp');
      }
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const valid = await trigger(['fullName', 'email', 'phoneNumber']);
    if (valid) {
      setStep(2);
    }
  };

  return (
    <>
      {loading && <Loading />}

      {step === 2 && (
        <span
          className="absolute left-0 top-0 flex cursor-pointer"
          onClick={() => setStep(1)}
        >
          <Typography>Back</Typography>
        </span>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          {step === 1 && (
            <>
              <TextField
                id="fullname_field"
                name="fullName"
                placeholder="Full Name"
                className="mb-8 w-[270px]"
                rules={{
                  required: 'Full Name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                }}
              />

              <TextField
                id="email_field"
                name="email"
                type="email"
                placeholder="Your Email"
                className="mb-8 w-[270px]"
                rules={{
                  required: 'Email is required',
                  validate: email,
                }}
              />

              <TextField
                id="phone_number_field"
                name="phoneNumber"
                placeholder="Phone Number"
                className="mb-10 w-[270px]"
                rules={{
                  required: 'Phone Number is required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Only numbers allowed',
                  },
                  minLength: {
                    value: 8,
                    message: 'Minimum 8 digits',
                  },
                }}
                selectedCountryCode={countryCode}
                onCountryCodeChange={(val) => setCountryCode(val)}
                countryCodes={[
                  { label: '+62', value: '+62' },
                  { label: '+1', value: '+1' },
                  { label: '+65', value: '+65' },
                  { label: '+44', value: '+44' },
                ]}
              />
              <Button
                id="continue_button"
                type="button"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                id="password_field"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="mb-8 w-[270px]"
                rules={{ required: 'Password is required' }}
                endIcon={showPassword ? eyeOpened : eyeClosed}
                onEndIconClick={() => setShowPassword(!showPassword)}
              />

              <Box className="flex items-center gap-4 relative mb-8">
                <TextField
                  id="repeat_password_field"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat Password"
                  className="w-[270px]"
                  rules={{
                    required: 'Repeat Password is required',
                    validate: (value) =>
                      value === getValues('password') ||
                      'Password does not match',
                  }}
                  endIcon={showConfirmPassword ? eyeOpened : eyeClosed}
                  onEndIconClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />

                {password && confirmPassword && (
                  <Box className="absolute right-[-32px] top-[9px]">
                    <Image
                      src={isPasswordMatch ? SuccessIcon : errorIcon}
                      alt="match indicator"
                      width={24}
                      height={24}
                    />
                  </Box>
                )}
              </Box>

              {/* Password Strength */}
              <Box className="mb-10 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2 px-3">
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

              {/* Checkbox Terms */}
              <Box className="flex w-[335px] mb-6">
                <Checkbox
                  id="register_checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  variant="style2"
                >
                  <Typography size={12} className="text-white">
                    I agree to the{' '}
                    <span className="underline cursor-pointer">
                      terms and conditions
                    </span>{' '}
                    and{' '}
                    <span className="underline cursor-pointer">
                      privacy policy
                    </span>{' '}
                    applicable at Wukong
                  </Typography>
                </Checkbox>
              </Box>

              <Button
                id="register_button"
                type="submit"
                disabled={!allValid || loading}
              >
                Submit
              </Button>
            </>
          )}

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

export default RegisterForm;
