import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { setAuthCookies } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/auth/login', formData);

    const body = data.body;

    if (!body?.accessToken || !body?.user) {
      return NextResponse.json(
        { success: false, message: 'Invalid login response from server' },
        { status: 500 }
      );
    }

    // Set cookies using helper
    await setAuthCookies({
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
      userRole: body.user.role,
    });

    return NextResponse.json({
      message: 'Login success',
      success: true,
      data: body.user,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
