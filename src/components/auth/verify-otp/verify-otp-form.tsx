'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAtom } from 'jotai';
import { otpExpiresAtAtom, registerFormAtom } from '@/store';
import { getErrorMessage } from '@/lib/api/error-handler';
import { Box, Typography } from '@/components';
import Loading from '@/components/layout/loading';
import debounce from '@/utils/debounce';
import { formatCountdownTime } from '@/utils/formatter';
import SuccessModal from './success-modal';

const VerifyOtpForm = () => {
  const router = useRouter();

  // Initialize state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoad, setResendLoad] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [isResentSuccess, setIsResentSuccess] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [payload] = useAtom(registerFormAtom);
  const [expiresAt, setExpiresAt] = useAtom(otpExpiresAtAtom);

  // Validate if form is complete
  const isFormValid = otp.every(digit => digit !== '' && /^\d$/.test(digit));

  const focusFirst = () => {
    const el = inputRefs.current[0];
    if (el) {
      el.focus();
      try {
        el.setSelectionRange(0, 1);
      } catch {}
    }
  };

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
        setExpiresAt(response.data.expiresAt);
        (debouncedSubmit as any)?.cancel?.();
        setOtp(['', '', '', '', '', '']);

        setTimeout(() => setIsResentSuccess(false), 3000);
      }
    } catch (err) {
      setError(getErrorMessage(err));
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
      setIsSuccess(false);
      setOtp(['', '', '', '', '', '']);
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
        (debouncedSubmit as any)?.cancel?.();

        setOtp(['', '', '', '', '', '']);
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
    [onSubmit]
  );

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const msLeft = expiresAt * 1000 - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));
      setSeconds(next);
    };

    update();
    const id = setInterval(update, 1000);

    const onVis = () => update();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [expiresAt]);

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
    if (!loading && !isSuccess && otp.every(d => d === '')) {
      requestAnimationFrame(() => {
        focusFirst();
      });
    }
  }, [loading, isSuccess, otp]);

  if (!payload.phoneNumber) return null;

  return (
    <Box className="flex flex-col items-center">
      {loading && <Loading />}

      <Typography className="my-4 text-center">
        We already sent you one time password to this number{' '}
        {payload.phoneNumber}
      </Typography>

      {!modalOpen && (
        <Typography
          className={`mb-2 ${seconds < 60 ? 'text-danger' : 'text-white'}`}>
          {formatCountdownTime(seconds)}
        </Typography>
      )}

      <Box className="mt-8 mb-2 flex gap-4">
        {otp.map((value, index) => (
          <input
            id={`otp_code_${index + 1}_field`}
            key={index}
            ref={el => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete="one-time-code"
            aria-label={`OTP digit ${index + 1}`}
            disabled={loading || isSuccess}
            className={`h-10 w-8 bg-white text-center text-[16px] font-bold text-black transition-all outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:border focus:shadow-[4px_4px_0px_0px_#FFFF] ${error ? 'border-danger' : ''}`}
            value={value}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
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
        className={`mt-4 flex gap-1 transition-opacity duration-500 ${
          isResentSuccess || seconds === 0 ? 'opacity-100' : 'opacity-0'
        }`}>
        <Typography size={12}>
          {isResentSuccess ? 'OTP has been resent' : "Didn't get the OTP?"}
        </Typography>

        {!isResentSuccess && seconds === 0 && (
          <Typography size={12}>
            {resendLoad ? (
              'Sending OTP...'
            ) : (
              <span
                id="btn_rgs_otp_resend"
                onClick={reSendOtp}
                className="cursor-pointer underline"
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    reSendOtp();
                  }
                }}>
                Resend OTP
              </span>
            )}
          </Typography>
        )}
      </Box>

      {/* Success Modal */}
      <SuccessModal open={modalOpen} onLogin={() => router.replace('/login')} />
    </Box>
  );
};

export default VerifyOtpForm;
