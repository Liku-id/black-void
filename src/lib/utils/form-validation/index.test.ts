import { email, password } from '.';

describe('email validator', () => {
  it('returns error message for invalid emails', () => {
    expect(email('notanemail')).toBe('Invalid email address');
    expect(email('missing@domain')).toBe('Invalid email address');
    expect(email('missing.domain@')).toBe('Invalid email address');
    expect(email('')).toBeUndefined();
  });

  it('returns undefined for valid emails', () => {
    expect(email('test@example.com')).toBeUndefined();
    expect(email('user.name+tag@sub.domain.co')).toBeUndefined();
  });
});

describe('password validator', () => {
  it('returns error message for invalid passwords', () => {
    expect(password('password')).toBe(
      'Password should contain at least one digit or one special character and one uppercase letter'
    );
    expect(password('PASSWORD1')).toBeUndefined();
    expect(password('passW1')).toBe(
      'Password should contain at least one digit or one special character and one uppercase letter'
    );
    expect(password('')).toBe(
      'Password should contain at least one digit or one special character and one uppercase letter'
    );
  });

  it('returns undefined for valid passwords', () => {
    expect(password('Secure123')).toBeUndefined();
    expect(password('A1b2c3d4!')).toBeUndefined();
    expect(password('Password@2024')).toBeUndefined();
  });
});
