import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Determine the payload based on channel
    let payload;
    if (formData.channel === 'email') {
      payload = {
        email: formData.email,
        channel: formData.channel,
      };
    } else {
      // Default to phoneNumber (WhatsApp/SMS)
      payload = {
        phoneNumber: formData.phoneNumber,
      };
    }

    const { data } = await axios.post('/v1/auth/otp/request', payload);

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
