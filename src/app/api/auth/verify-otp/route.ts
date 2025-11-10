import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Build payload based on channel
    let payload;
    if (formData.channel === 'email') {
      payload = {
        email: formData.email,
        code: formData.code,
        channel: formData.channel,
      };
    } else {
      // Default to phoneNumber (WhatsApp/SMS)
      payload = {
        phoneNumber: formData.phoneNumber,
        code: formData.code,
      };
    }

    await axios.post('/v1/auth/otp/verification', payload);

    return NextResponse.json({
      message: 'OTP verify success',
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
