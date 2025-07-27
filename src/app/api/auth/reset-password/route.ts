import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    await axios.post('/v1/auth/password/change', {
      email: formData.email,
      token: formData.token,
      newPassword: formData.newPassword,
    });

    return NextResponse.json({
      message: 'Password reset successful',
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
} 