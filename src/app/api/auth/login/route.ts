// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { saveSession } from '@/lib/session';
import { cookies } from 'next/headers';

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

    // Save session with user data (iron-session)
    await saveSession({
      isLoggedIn: true,
      user: body.user,
    });

    // Save access_token & user_role in cookies for middleware
    const cookieStore = await cookies();
    cookieStore.set('access_token', body.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set('user_role', body.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
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
