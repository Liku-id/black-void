import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { setAuthCookies } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/auth/login', formData);

    const response = NextResponse.json({
      message: 'Login success',
      success: true,
      data: data.body?.user,
    });

    setAuthCookies(response, {
      accessToken: data.body.accessToken,
      refreshToken: data.body.refreshToken,
      userRole: data.body?.user?.role,
    });

    return response;
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}