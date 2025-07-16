import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    console.log(formData, '<<masuk');

    const { data } = await axios.post('/v1/auth/otp/request', formData);

    console.log(data, '<<data');

    return NextResponse.json({
      message: 'OTP sent successfully',
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
