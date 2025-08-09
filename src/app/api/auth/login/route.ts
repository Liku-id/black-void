import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { setAuthCookies } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const { data } = await axios.post('/v1/auth/login', payload.form);
    const body = data.body;

    // Validation origin
    if (
      (payload.origin === '/login' && body?.user?.role === 'ground_staff') ||
      (payload.origin === '/ticket/auth' && body?.user?.role === 'buyer')
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Access denied. Your account role is not permitted to perform this action.',
        },
        { status: 403 }
      );
    }

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
