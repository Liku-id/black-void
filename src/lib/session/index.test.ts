import { setAuthCookies } from './index';

// Mock next/headers
const mockCookieStore = {
  set: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
}));

describe('Session Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setAuthCookies', () => {
    it('should set access token cookie with correct options', async () => {
      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      };

      await setAuthCookies(cookieOptions);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'access_token',
        'test-access-token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24, // 1 day
        }
      );
    });

    it('should set refresh token cookie with correct options', async () => {
      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      };

      await setAuthCookies(cookieOptions);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'refresh_token',
        'test-refresh-token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }
      );
    });

    it('should set user role cookie when provided', async () => {
      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userRole: 'admin',
      };

      await setAuthCookies(cookieOptions);

      expect(mockCookieStore.set).toHaveBeenCalledWith('user_role', 'admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    });

    it('should not set user role cookie when not provided', async () => {
      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      };

      await setAuthCookies(cookieOptions);

      // Should only call set 2 times (access_token and refresh_token)
      expect(mockCookieStore.set).toHaveBeenCalledTimes(2);

      // Verify user_role was not set
      const calls = mockCookieStore.set.mock.calls;
      const userRoleCall = calls.find((call) => call[0] === 'user_role');
      expect(userRoleCall).toBeUndefined();
    });

    it('should set all cookies with correct security settings in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userRole: 'user',
      };

      await setAuthCookies(cookieOptions);

      // Check that secure is true in production
      const calls = mockCookieStore.set.mock.calls;
      calls.forEach((call) => {
        const options = call[2];
        expect(options.secure).toBe(true);
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should set all cookies with correct security settings in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userRole: 'user',
      };

      await setAuthCookies(cookieOptions);

      // Check that secure is false in development
      const calls = mockCookieStore.set.mock.calls;
      calls.forEach((call) => {
        const options = call[2];
        expect(options.secure).toBe(false);
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should set correct maxAge for different cookies', async () => {
      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userRole: 'user',
      };

      await setAuthCookies(cookieOptions);

      const calls = mockCookieStore.set.mock.calls;

      // Access token should have 1 day maxAge
      const accessTokenCall = calls.find((call) => call[0] === 'access_token');
      expect(accessTokenCall[2].maxAge).toBe(60 * 60 * 24);

      // Refresh token should have 7 days maxAge
      const refreshTokenCall = calls.find(
        (call) => call[0] === 'refresh_token'
      );
      expect(refreshTokenCall[2].maxAge).toBe(60 * 60 * 24 * 7);

      // User role should have 7 days maxAge
      const userRoleCall = calls.find((call) => call[0] === 'user_role');
      expect(userRoleCall[2].maxAge).toBe(60 * 60 * 24 * 7);
    });

    it('should set all cookies with consistent options', async () => {
      const cookieOptions = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userRole: 'user',
      };

      await setAuthCookies(cookieOptions);

      const calls = mockCookieStore.set.mock.calls;

      calls.forEach((call) => {
        const options = call[2];
        expect(options.httpOnly).toBe(true);
        expect(options.sameSite).toBe('lax');
        expect(options.path).toBe('/');
      });
    });

    it('should handle empty tokens', async () => {
      const cookieOptions = {
        accessToken: '',
        refreshToken: '',
      };

      await setAuthCookies(cookieOptions);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'access_token',
        '',
        expect.any(Object)
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'refresh_token',
        '',
        expect.any(Object)
      );
    });

    it('should handle special characters in tokens', async () => {
      const cookieOptions = {
        accessToken: 'token-with-special-chars!@#$%^&*()',
        refreshToken: 'refresh-token-with-special-chars!@#$%^&*()',
        userRole: 'role-with-special-chars!@#$%^&*()',
      };

      await setAuthCookies(cookieOptions);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'access_token',
        'token-with-special-chars!@#$%^&*()',
        expect.any(Object)
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token-with-special-chars!@#$%^&*()',
        expect.any(Object)
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'user_role',
        'role-with-special-chars!@#$%^&*()',
        expect.any(Object)
      );
    });
  });
});
