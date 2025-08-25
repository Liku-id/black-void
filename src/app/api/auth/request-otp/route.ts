import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/auth/otp/request', formData);

    const expiredIn = data.expiredIn ?? 180;
    const nowSec = Math.floor(Date.now() / 1000);
    const expiresAt = nowSec + expiredIn;

    return NextResponse.json({
      message: 'OTP sent successfully',
      success: true,
      expiredIn,
      expiresAt,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
