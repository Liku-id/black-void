import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

const EXPIRY_TIMES = {
  ACCESS_TOKEN: 60 * 60 * 24, // 1 day
  REFRESH_TOKEN: 60 * 60 * 24 * 7, // 7 days
  USER_ROLE: 60 * 60 * 24, // 1 day
};

export function setAuthCookies(
  response: NextResponse,
  tokens: {
    accessToken: string;
    refreshToken: string;
    userRole: string;
  }
) {
  response.headers.append(
    'Set-Cookie',
    serialize('access_token', tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: EXPIRY_TIMES.ACCESS_TOKEN,
    })
  );

  response.headers.append(
    'Set-Cookie',
    serialize('refresh_token', tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: EXPIRY_TIMES.REFRESH_TOKEN,
    })
  );

  response.headers.append(
    'Set-Cookie',
    serialize('user_role', tokens.userRole, {
      ...COOKIE_OPTIONS,
      maxAge: EXPIRY_TIMES.USER_ROLE,
    })
  );
}

export function clearAuthCookies(response: NextResponse) {
  const clearCookieOptions = {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  };

  response.headers.append(
    'Set-Cookie',
    serialize('access_token', '', clearCookieOptions)
  );

  response.headers.append(
    'Set-Cookie',
    serialize('refresh_token', '', clearCookieOptions)
  );

  response.headers.append(
    'Set-Cookie',
    serialize('user_role', '', clearCookieOptions)
  );
}