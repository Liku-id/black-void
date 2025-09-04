import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/auth/otp/request', formData);

    console.log(data, 'data otp');

    const expiresAtSec = Math.floor(new Date(data.expiredAt).getTime() / 1000);

    return NextResponse.json({
      message: 'OTP sent successfully',
      success: true,
      expiresAt: expiresAtSec,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
