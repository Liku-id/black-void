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

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  if (userRole) {
    cookieStore.set('user_role', userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}
