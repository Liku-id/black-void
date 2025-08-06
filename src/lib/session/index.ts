import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
export interface SessionData {
  user?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role?: string;
  };
  isLoggedIn: boolean;
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'wukong-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

interface CookieOptions {
  accessToken: string;
  refreshToken: string;
  userRole?: string; // optional for refresh route
}

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

export async function saveSession(session: SessionData) {
  const currentSession = await getSession();
  Object.assign(currentSession, session);
  await currentSession.save();
}

export async function clearSession() {
  const session = await getSession();
  session.destroy();
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
