import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    const { data } = await axios.get(`/v1/transactions/${id}`);
    return NextResponse.json({
      transaction: data.body,
      message: data.message,
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
