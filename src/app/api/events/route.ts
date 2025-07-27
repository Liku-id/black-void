import { NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET() {
  try {
    const res = await axios.get('/v1/events');
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
