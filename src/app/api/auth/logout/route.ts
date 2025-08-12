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
        .catch(err => {
          console.warn('Backend logout failed (ignored):', err);
        });
    }
  } catch (err) {
    console.warn('Backend logout failed, proceeding with local logout:', err);
  }

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('user_role');

  return NextResponse.json({
    success: true,
    message: 'Logout successful',
  });
}
