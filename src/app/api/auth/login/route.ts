import axios from '@/lib/api/axios-server';
import { setAuthCookies } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

type LoginErrorResponse = {
  response: {
    data: {
      details: [{ value: { email?: string; phoneNumber?: string } }];
      message: string;
    };
  };
  status?: number;
};

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
            'Access denied. Your account is not permitted to perform this action',
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
  } catch (e: any) {
    const status = e?.response?.status || 500;
    const data = e?.response?.data?.details?.[0]?.value || null;
    const message = e?.response?.data?.message || 'An error occurred';

    return NextResponse.json(
      {
        message,
        data,
        success: false,
      },
      { status }
    );
  }
}
