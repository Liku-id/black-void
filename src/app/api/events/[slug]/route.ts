import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const res = await axios.get(`/v1/events/${slug}`);
    const data = res.data;

    if (res.status !== 200) {
      return handleErrorAPI({
        message: data.message || 'Event not found',
        status: res.status,
      });
    }
    if (data.statusCode !== 0 || !data.body) {
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
