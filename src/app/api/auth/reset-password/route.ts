import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('reset_token')?.value;
    const email = request.cookies.get('reset_email')?.value;

    if (!token || !email) {
      return NextResponse.json(
        {
          message: 'Invalid or expired reset session',
          success: false,
        },
        { status: 400 }
      );
    }

    const formData = await request.json();

    await axios.post('/v1/auth/password/change', {
      email: email,
      token: token,
      newPassword: formData.password,
    });

    const response = NextResponse.json({
      message: 'Password reset successful',
      success: true,
    });

    response.cookies.delete('reset_token');
    response.cookies.delete('reset_email');

    return response;
  } catch (e) {
    const errorResponse = handleErrorAPI(e as AxiosErrorResponse);

    if (errorResponse instanceof NextResponse) {
      errorResponse.cookies.delete('reset_token');
      errorResponse.cookies.delete('reset_email');
      return errorResponse;
    }

    return errorResponse;
  }
}
