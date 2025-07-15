'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loading from '@/components/layout/loading';
import { Box, Typography } from '@/components';

const VerifyOtpForm = () => {
  const router = useRouter();

  // Initialize state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(59);
  const [error, setError] = useState('');

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    setOtp((prev) => prev.map((_, idx) => (paste[idx] ? paste[idx] : '')));
    e.preventDefault();
  };

  const onSubmit = async (code: string) => {
    try {
    } catch (error) {}
  };

  useEffect(() => {
    if (!seconds) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    if (otp.every((v) => v !== '')) {
      onSubmit(otp.join(''));
    }
  }, [otp]);

  return (
    <Box className="flex flex-col items-center">
      {loading && <Loading />}

      <Typography>{`00:${seconds.toString().padStart(2, '0')}`}</Typography>

      <Box className="flex gap-4 mt-8 mb-2">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-8 h-10 bg-white text-black text-center text-[16px] font-bold outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:border focus:shadow-[4px_4px_0px_0px_#FFFF]"
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
          />
        ))}
      </Box>
      {error && (
        <Typography size={12} className="text-danger mt-2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default VerifyOtpForm;
