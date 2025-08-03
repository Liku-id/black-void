import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { saveSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/auth/login', formData);

    // Save session with user data
    await saveSession({
      isLoggedIn: true,
      user: data.body?.user,
    });

    return NextResponse.json({
      message: 'Login success',
      success: true,
      data: data.body?.user,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}