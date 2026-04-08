import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get('page') ?? '0';
    const limit = searchParams.get('limit') ?? '12';

    const { data } = await axios.get(
      `/v1/events?status=EVENT_STATUS_ON_GOING&status=EVENT_STATUS_APPROVED&status=EVENT_STATUS_DONE&limit=${limit}&page=${page}`
    );

    const events = data.body?.data ?? [];
    const total = data.body?.total ?? data.body?.count ?? events.length;

    return NextResponse.json({
      events,
      total,
      page: Number(page),
      limit: Number(limit),
      hasMore: events.length === Number(limit),
    });
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
