import { NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET() {
  try {
    const { data } = await axios.get(
      '/v1/events?status=EVENT_STATUS_ON_GOING&status=EVENT_STATUS_APPROVED&status=EVENT_STATUS_DONE&limit=50&page=0'
    );
    return NextResponse.json({ events: data.body?.data });
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
