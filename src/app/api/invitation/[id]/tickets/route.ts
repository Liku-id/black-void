import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = `/v1/ticket-invitations/${id}`;
    const res = await axios.get(url);
    const data = res.data;

    if (res.status !== 200) {
      return handleErrorAPI({
        message: data.message || 'Invitation not found',
        status: res.status,
      });
    }
    if (!data.body) {
      return handleErrorAPI({
        message: data.message || 'Invalid response from backend',
        status: 500,
      });
    }

    return NextResponse.json(data.body);
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
