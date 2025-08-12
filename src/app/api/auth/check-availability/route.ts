import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data } = await axios.post('/v1/users/check-availability', formData);

    return NextResponse.json({
      message: 'User available',
      success: true,
      isValid: data.body?.isValid,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
