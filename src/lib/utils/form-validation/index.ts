export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const password = (value: string) =>
  value &&
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~])[A-Za-z\d!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]{8,12}$/.test(
    value
  )
    ? undefined
    : 'Password must be 8–12 characters long and include at least one uppercase letter, one number, and one special character.';
