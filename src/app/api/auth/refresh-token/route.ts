import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { cookies } from 'next/headers';
import { setAuthCookies } from '@/lib/session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token found' },
        { status: 401 }
      );
    }

    const { data } = await axios.post('/v1/auth/refresh-token', {
      refreshToken,
    });
    const body = data.body;

    if (!body?.accessToken || !body?.refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh response from server' },
        { status: 500 }
      );
    }

    await setAuthCookies({
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    });

    return NextResponse.json({
      message: 'Token refreshed successfully',
      success: true,
      accessToken: body.accessToken,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
