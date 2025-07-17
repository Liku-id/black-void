import { email, validatePassword } from './index';

describe('email validation', () => {
  it('returns error for invalid email', () => {
    expect(email('invalid-email')).toBe('Invalid email format');
    expect(email('test@invalid')).toBe('Invalid email format');
  });

  it('returns undefined for valid email', () => {
    expect(email('test@example.com')).toBeUndefined();
  });
});

describe('validatePassword', () => {
  it('validates length', () => {
    expect(validatePassword('Short1!')).toBe(
      'Password must be between 8-12 characters'
    );
    expect(validatePassword('VeryLongPassword1!')).toBe(
      'Password must be between 8-12 characters'
    );
  });

  it('requires uppercase letter', () => {
    expect(validatePassword('password1!')).toBe(
      'Password must contain at least 1 uppercase letter'
    );
  });

  it('requires number', () => {
    expect(validatePassword('Password!')).toBe(
      'Password must contain at least 1 number'
    );
  });

  it('requires special character', () => {
    expect(validatePassword('Password1')).toBe(
      'Password must contain at least 1 special character'
    );
  });

  it('returns true for valid password', () => {
    expect(validatePassword('Password1!')).toBe(true);
  });
});
