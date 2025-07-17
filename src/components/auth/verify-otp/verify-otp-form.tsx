'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAtom } from 'jotai';
import { registerFormAtom } from '@/store';
import { getErrorMessage } from '@/lib/api/error-handler';
import { Box, Typography } from '@/components';
import Loading from '@/components/layout/loading';
import debounce from '@/utils/debounce';
import SuccessModal from './success-modal';

const VerifyOtpForm = () => {
  const router = useRouter();

  // Initialize state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoad, setResendLoad] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState('');
  const [isResentSuccess, setIsResentSuccess] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [payload] = useAtom(registerFormAtom);

  // Validate if form is complete
  const isFormValid = otp.every((digit) => digit !== '' && /^\d$/.test(digit));

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      newOtp[i] = paste[i] || '';
    }

    setOtp(newOtp);
    setError('');

    // Focus to the last filled input or next empty one
    const lastFilledIndex = Math.min(paste.length, 5);
    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Resend OTP handler
  const reSendOtp = async () => {
    if (resendLoad) return;

    setResendLoad(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/request-otp', {
        phoneNumber: payload.phoneNumber,
      });

      if (response.status === 200) {
        setIsResentSuccess(true);
        setSeconds(60);
        setOtp(['', '', '', '', '', '']);

        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }

        setTimeout(() => {
          setIsResentSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setResendLoad(false);
    }
  };

  // Submit user registration
  const submitRegister = useCallback(async () => {
    try {
      const response = await axios.post('/api/auth/register', payload);

      if (response.status === 200) {
        setModalOpen(true);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }, [payload]);

  // Submit OTP verification
  const onSubmit = useCallback(
    async (code: string) => {
      if (loading || isSuccess) return;

      setLoading(true);
      setError('');

      try {
        const response = await axios.post('/api/auth/verify-otp', {
          phoneNumber: payload.phoneNumber,
          code,
        });

        if (response.status === 200) {
          setIsSuccess(true);
          await submitRegister();
        }
      } catch (error) {
        setError(getErrorMessage(error));
        setOtp(['', '', '', '', '', '']);

        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }
      } finally {
        setLoading(false);
      }
    },
    [payload.phoneNumber, loading, isSuccess, submitRegister]
  );

  // Debounced submit function
  const debouncedSubmit = useCallback(
    debounce((code: string) => {
      onSubmit(code);
    }, 300),
    [payload.phoneNumber]
  );

  // Timer effect
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (isFormValid && !loading && !isSuccess) {
      debouncedSubmit(otp.join(''));
    }
  }, [otp, isFormValid, loading, isSuccess]);

  // Redirect if no phone number
  useEffect(() => {
    if (!payload.phoneNumber) {
      router.replace('/register');
    }
  }, [payload.phoneNumber, router]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  if (!payload.phoneNumber) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box className="flex flex-col items-center">
      {loading && <Loading />}

      <Typography className="my-4 text-center">
        We already sent you one time password to this number{' '}
        {payload.phoneNumber}
      </Typography>

      <Typography className="mb-2">{formatTime(seconds)}</Typography>

      <Box className="flex gap-4 mt-8 mb-2">
        {otp.map((value, index) => (
          <input
            id={`otp_code_${index + 1}_field`}
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete="one-time-code"
            aria-label={`OTP digit ${index + 1}`}
            disabled={loading || isSuccess}
            className={`w-8 h-10 bg-white text-black text-center text-[16px] font-bold outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:border focus:shadow-[4px_4px_0px_0px_#FFFF] ${error ? 'border-danger' : ''}`}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
          />
        ))}
      </Box>

      {error && (
        <Typography size={12} className="text-danger mt-2 text-center">
          {error}
        </Typography>
      )}

      <Box
        className={`flex mt-4 gap-1 transition-opacity duration-500 ${
          isResentSuccess || seconds === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Typography size={12}>
          {isResentSuccess ? 'OTP has been resent' : "Didn't get the OTP?"}
        </Typography>

        {!isResentSuccess && seconds === 0 && (
          <Typography size={12}>
            {resendLoad ? (
              'Sending OTP...'
            ) : (
              <span
                id="resend_otp_link"
                onClick={reSendOtp}
                className="underline cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    reSendOtp();
                  }
                }}
              >
                Resend OTP
              </span>
            )}
          </Typography>
        )}
      </Box>

      {/* Success Modal */}
      <SuccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLogin={() => router.replace('/login')}
      />
    </Box>
  );
};

export default VerifyOtpForm;
