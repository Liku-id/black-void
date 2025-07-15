import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    await axios.post('/v1/auth/opt/request', formData);

    return NextResponse.json({
      message: 'OTP sent success',
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
