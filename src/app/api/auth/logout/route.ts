import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const formData = await request.json();

    await axios.post('/v1/auth/logout', formData, {
      headers: {
        Authorization: authHeader,
      },
    });

    const response = NextResponse.json({ message: 'Logout successful' });

    response.headers.append(
      'Set-Cookie',
      serialize('access_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 0,
      })
    );

    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 0,
      })
    );

    return response;
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
