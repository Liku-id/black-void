'use client';

import emailIcon from '@/assets/icons/email.svg';
import phoneIcon from '@/assets/icons/phone.svg';
import { Box, Typography } from '@/components';
import Loading from '@/components/layout/loading';
import axios from '@/lib/api/axios-client';
import { getErrorMessage } from '@/lib/api/error-handler';
import { useAuth } from '@/lib/session/use-auth';
import {
  otpExpiresAtAtom,
  registerFormAtom,
  verificationChannelAtom,
} from '@/store/atoms/auth';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChooseVerificationFormProps {
  redirectPath?: string;
}

const ChooseVerificationForm = ({
  redirectPath,
}: ChooseVerificationFormProps) => {
  const router = useRouter();
  const { userData } = useAuth();
  const [registerPayload, setRegisterPayload] = useAtom(registerFormAtom);

  // Initialize state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setExpiresAt] = useAtom(otpExpiresAtAtom);
  const [, setChannel] = useAtom(verificationChannelAtom);

  // Check if from login (userData exists) or from register (registerPayload exists)
  const isFromLogin = !!(userData?.email || userData?.phoneNumber);

  // Get email and phone from appropriate source
  const email = isFromLogin ? (userData?.email || '') : (registerPayload.email || '');
  const phoneNumber = isFromLogin
    ? (userData?.phoneNumber || '')
    : (registerPayload.phoneNumber || '');

  // Redirect if no data - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (!email && !phoneNumber) {
      router.replace(isFromLogin ? '/login' : '/register');
    }
  }, [email, phoneNumber, isFromLogin, router]);

  const handleSendOtp = async (channel: 'email' | 'phoneNumber') => {
    setError('');
    setLoading(true);

    try {
      const requestPayload =
        channel === 'email'
          ? {
              email,
              channel: 'email',
            }
          : {
              phoneNumber,
            };

      const response = await axios.post(
        '/api/auth/request-otp',
        requestPayload
      );

      if (response.status === 200) {
        setExpiresAt(response.data.expiresAt || null);
        setChannel(channel);

        // Store channel in registerFormAtom for register flow
        if (!isFromLogin) {
          setRegisterPayload({
            ...registerPayload,
            channel,
          });
        }

        // Use custom redirect path or default based on flow
        const defaultPath = isFromLogin
          ? '/login/verify-otp'
          : '/register/verify-otp';
        router.replace(redirectPath || defaultPath);
      }
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no data
  if (!email || !phoneNumber) {
    router.replace(isFromLogin ? '/login' : '/register');
    return null;
  }

  return (
    <>
      {loading && <Loading />}

      <Box className="mt-10 flex flex-col items-center gap-6">
        {/* Email Option */}
        {email && (
          <button
            id="btn_verify_email"
            onClick={() => handleSendOtp('email')}
            disabled={loading}
            className="group relative w-full max-w-[335px] border border-white bg-transparent px-6 py-4 text-left transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_#FFFFFF] disabled:cursor-not-allowed disabled:opacity-50">
          <Box className="flex items-center gap-4">
            <Box className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <Image src={emailIcon} alt="Email" width={24} height={24} />
            </Box>
            <Box className="flex min-w-0 flex-1 flex-col">
              <Typography type="body" size={16} className="mb-1 font-light">
                Send via Email
              </Typography>
              <Typography size={12} className="font-light text-white">
                {email?.replace(
                  /(.*)(.{3})(@.*)/,
                  (
                    _match: string,
                    start: string,
                    last3: string,
                    domain: string
                  ) => '*'.repeat(start.length) + last3 + domain
                ) || ''}
              </Typography>
            </Box>
          </Box>
        </button>
        )}

        {/* WhatsApp/SMS Option */}
        {phoneNumber && (
          <button
          id="btn_verify_whatsapp"
          onClick={() => handleSendOtp('phoneNumber')}
          disabled={loading}
          className="group relative w-full max-w-[335px] border border-white bg-transparent px-6 py-4 text-left transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_#FFFFFF] disabled:cursor-not-allowed disabled:opacity-50">
          <Box className="flex items-center gap-4">
            <Box className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <Image src={phoneIcon} alt="Phone" width={24} height={24} />
            </Box>
            <Box className="flex min-w-0 flex-1 flex-col">
              <Typography type="body" size={16} className="mb-1 font-light">
                Send via WhatsApp/SMS
              </Typography>
              <Typography size={12} className="font-light text-white">
                {phoneNumber?.replace(
                  /.*(\d{3})$/,
                  (match: string, last3: string) =>
                    '*'.repeat(match.length - 3) + last3
                ) || ''}
              </Typography>
            </Box>
          </Box>
        </button>
        )}

        {error && (
          <Typography size={12} className="text-danger mt-2 text-center">
            {error}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ChooseVerificationForm;
