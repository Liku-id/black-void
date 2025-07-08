'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/common/Button';
import { TextField } from '@/components/common/TextField';
import { email, password } from '@/lib/utils/form-validation';
import { FormProvider, useForm } from 'react-hook-form';
import eyeClosed from '@/assets/icons/eye-closed.svg';
import eyeOpened from '@/assets/icons/eye-open.svg';

interface FormDataLogin {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();

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
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <TextField
          id="input_email"
          name="email"
          type="email"
          placeholder="Email Address"
          className="w-[270px] mb-7"
          rules={{ required: true, validate: email }}
        />

        <TextField
          id="input_password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-[270px] mb-10"
          rules={{ required: true }}
          endIcon={showPassword ? eyeOpened : eyeClosed}
          onEndIconClick={() => setShowPassword(!showPassword)}
        />

        <Button>Log In</Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
