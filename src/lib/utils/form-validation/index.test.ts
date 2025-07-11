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
      'Password min 8 characters long and include at least one uppercase letter, one number, and one special character.'
    );
    expect(password('PAWORD1')).toBeUndefined();
    expect(password('passW1')).toBe(
      'Password min 8 characters long and include at least one uppercase letter, one number, and one special character.'
    );
    expect(password('')).toBe(
      'Password min 8 characters long and include at least one uppercase letter, one number, and one special character.'
    );
  });

  it('returns undefined for valid passwords', () => {
    expect(password('Secure#123')).toBeUndefined();
    expect(password('A1b2c3dJ4!')).toBeUndefined();
    expect(password('Password@20')).toBeUndefined();
  });
});
