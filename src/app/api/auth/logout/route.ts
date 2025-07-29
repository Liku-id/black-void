import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { clearAuthCookies } from '@/lib/cookies';


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

    clearAuthCookies(response);

    return response;
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}