import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from '@/lib/api/axios-server';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const authHeader = request.headers.get('authorization');

  let force = false;
  try {
    const body = await request.json();
    force = Boolean(body?.force);
  } catch {}

  try {
    if (!force) {
      axios
        .post('/v1/auth/logout', null, {
          headers: authHeader ? { Authorization: authHeader } : {},
        })
        .catch((err) => {
          console.warn('Backend logout failed (ignored):', err);
        });
    }
  } catch (err) {
    console.warn('Backend logout failed, proceeding with local logout:', err);
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    expires: new Date(0),
  };

  cookieStore.set('access_token', '', options);
  cookieStore.set('refresh_token', '', options);
  cookieStore.set('user_role', '', options);

  const res = NextResponse.json({
    success: true,
    message: 'Logout successful',
  });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
