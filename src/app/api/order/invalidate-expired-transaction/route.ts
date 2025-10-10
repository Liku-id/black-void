import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const { data } = await axios.post(
      '/v1/orders/invaidate-expired-transaction'
    );
    return NextResponse.json({
      message: data.message,
      success: true,
      data: data.body,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
