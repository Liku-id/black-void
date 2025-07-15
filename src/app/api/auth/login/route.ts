import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { serialize } from 'cookie';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/auth/login', formData);

    const response = NextResponse.json({
      message: 'Login success',
      success: true,
    });

    // Set Cookies
    response.headers.set(
      'Set-Cookie',
      serialize('access_token', data.body.access_token, {
        // ...cookieOptions,
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 60 * 60 * 24,
      })
    );

    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', data.body.refresh_token, {
        // ...cookieOptions,
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return response;
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
