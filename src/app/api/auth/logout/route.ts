import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { clearSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const authHeader = request.headers.get('authorization');
  const { userId } = await request.json();

  try {
    if (userId) {
      await axios.post(
        '/v1/auth/logout',
        { userId },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
    }

    // Delete any session & cookies resulting from backend logout
    await clearSession();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('user_role');

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (e) {
    // If the backend fails, still delete the session so that the user is considered logged out.
    await clearSession();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('user_role');

    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
