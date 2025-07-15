export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email format'
    : undefined;

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
