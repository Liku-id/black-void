'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { email } from '@/utils/form-validation';
import { getErrorMessage } from '@/lib/api/error-handler';
import {
  Box,
  Button,
  TextField,
  Typography,
  PasswordCheck,
  Checkbox,
} from '@/components';
import eyeClosed from '@/assets/icons/eye-closed.svg';
import eyeOpened from '@/assets/icons/eye-open.svg';
import Loading from '@/components/layout/loading';
import roundCheck from '@/assets/icons/rounded-check.svg';
import errorIcon from '@/assets/icons/error.svg';

interface FormDataRegister {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const StepperForm = () => {
  const router = useRouter();

  // Initialize state
  const [agree, setAgree] = useState(false);
  const [countryCode, setCountryCode] = useState('+62');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
    capital: false,
  });

  const methods = useForm<FormDataRegister>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { trigger, getValues, handleSubmit, watch } = methods;

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const isPasswordMatch = password === confirmPassword;

  const validatePasswordStrength = (password: string) => {
    console.log(password, '<<  onPasswordChange?: (value: string) => void;');

    setPasswordStrength({
      length: password.length >= 8 && password.length <= 12,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      capital: /[A-Z]/.test(password),
    });
  };

  console.log(passwordStrength, '<<<passwordStrength');

  const onSubmit = async (formData: FormDataRegister) => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        phoneNumber: `${countryCode}${formData.phoneNumber}`,
      };

      const response = await axios.post('/api/auth/register', payload);
      if (response.status === 200) {
        router.push('/register/verify-otp');
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
                id="full_name_field"
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
                isPhoneNumber
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
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                }}
                endIcon={showPassword ? eyeOpened : eyeClosed}
                onEndIconClick={() => setShowPassword(!showPassword)}
                onPasswordChange={(value) => validatePasswordStrength(value)}
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
                      src={isPasswordMatch ? roundCheck : errorIcon}
                      alt="match indicator"
                      width={24}
                      height={24}
                    />
                  </Box>
                )}
              </Box>

              {/* Password Strength */}
              <Box className="grid grid-cols-2 gap-x-20 gap-3 w-[335px] text-xs text-white mb-5">
                <PasswordCheck
                  label="8-12 Character"
                  checked={passwordStrength.length}
                />
                <PasswordCheck
                  label="Number"
                  checked={passwordStrength.number}
                />
                <PasswordCheck
                  label="Special Character"
                  checked={passwordStrength.special}
                />
                <PasswordCheck
                  label="Capital Letters"
                  checked={passwordStrength.capital}
                />
              </Box>

              {/* Checkbox Terms */}
              <Box className="flex w-[335px] mb-6 gap-2">
                <Checkbox checked={agree} onChange={() => setAgree(!agree)} />

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
              </Box>

              <Button id="submit_button" type="submit" disabled={!agree}>
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

export default StepperForm;
