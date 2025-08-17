import { cookies } from 'next/headers';

interface CookieOptions {
  accessToken: string;
  refreshToken: string;
  userRole?: string; // optional for refresh route
}

export async function setAuthCookies({
  accessToken,
  refreshToken,
  userRole,
}: CookieOptions) {
  const cookieStore = await cookies();

  const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  cookieStore.set('access_token', accessToken, {
    ...baseOptions,
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set('refresh_token', refreshToken, {
    ...baseOptions,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  if (userRole) {
    cookieStore.set('user_role', userRole, {
      ...baseOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}
