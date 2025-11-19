import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const origin = request.headers.get('origin');

    const { data } = await axios.post('/v1/auth/password/request', formData, {
      headers: { 'X-Frontend-Origin': origin, Origin: origin },
    });

    let token = '';
    if (process.env.STAGING === 'true') {
      token = data.message?.split('Token: ')[1];
    }

    return NextResponse.json({
      message: 'Forgot password email sent',
      success: true,
      token,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
