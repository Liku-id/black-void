import { useMemo } from 'react';

export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email format'
    : undefined;

export const fullName = (value: string) => {
  if (!value) return undefined;
  if (value.length < 2) {
    return 'Minimum 2 characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(value)) {
    return 'Full Name cannot contain numbers or symbols';
  }
  return undefined;
};

export const phoneNumber = (value: string, countryCode: string = '+62') => {
  if (!value) return undefined;
  if (!/^[0-9]+$/.test(value)) {
    return 'Only numbers allowed';
  }
  if (value.startsWith('0')) {
    return 'Phone number cannot start with 0';
  }
  const totalLength = countryCode.replace('+', '').length + value.length;
  if (totalLength < 8) {
    return 'Minimum 8 digits total';
  }
  if (totalLength > 15) {
    return 'Maximum 15 digits total';
  }
  return undefined;
};

export const validatePassword = (value: string) => {
  if (value.length < 8 || value.length > 12) {
    return 'Password must be between 8-12 characters';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least 1 uppercase letter';
  }
  if (!/[0-9]/.test(value)) {
    return 'Password must contain at least 1 number';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return 'Password must contain at least 1 special character';
  }
  return true;
};

export const usePasswordValidation = (password: string = '') => {
  return useMemo(
    () => ({
      length: password.length >= 8 && password.length <= 12,
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      capital: /[A-Z]/.test(password),
    }),
    [password]
  );
};
