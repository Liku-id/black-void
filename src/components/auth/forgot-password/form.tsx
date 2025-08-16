'use client';

import { useState } from 'react';
import axios from '@/lib/api/axios-client';
import { FormProvider, useForm } from 'react-hook-form';
import { email } from '@/utils/form-validation';
import { getErrorMessage } from '@/lib/api/error-handler';
import { Button, TextField, Typography } from '@/components';
import Loading from '@/components/layout/loading';
import SentModal from './sent-modal';
import { useRouter } from 'next/navigation';

interface ForgotPasswordData {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  // Initialize state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const methods = useForm<ForgotPasswordData>({ mode: 'onChange' });

  const onSubmit = async (formData: ForgotPasswordData) => {
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/check-availability', {
        email: formData.email,
      });

      // If Email Is Registered
      if (data.isValid) {
        setError('The email you entered is not found');
        return;
      }

      // If Email Is Registered, proceed with forgot-password request
      const response = await axios.post('/api/auth/forgot-password', formData);
      if (response.status === 200) {
        setSentEmail(formData.email);
        setModalOpen(true);
        if (response.data.token) {
          router.replace(
            `/reset-password?token=${response.data.token}&email=${formData.email}`
          );
        }
      }
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!sentEmail) return;
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/forgot-password', { email: sentEmail });
    } catch (error) {
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
          className="flex flex-col items-center">
          <TextField
            id="email_field"
            name="email"
            type="email"
            placeholder="Email Address"
            className="mb-10 w-[270px]"
            rules={{ required: 'Email is required', validate: email }}
          />

          <Button id="send_link_button" type="submit">
            Send Link
          </Button>

          {error && (
            <Typography size={12} className="text-danger mt-2">
              {error}
            </Typography>
          )}
        </form>
      </FormProvider>

      <SentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sentEmail={sentEmail}
        onResend={handleResend}
        isLoading={loading}
      />
    </>
  );
};

export default ForgotPasswordForm;
