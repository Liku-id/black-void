import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const { data } = await axios.post('/v1/auth/otp/verification', formData);

    return NextResponse.json({
      message: 'OTP verify success',
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
