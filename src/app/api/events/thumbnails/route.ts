import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET(req: NextRequest) {
  try {
    const res = await axios.get(
      `/v1/events?status=EVENT_STATUS_ON_GOING&status=EVENT_STATUS_APPROVED&status=EVENT_STATUS_DONE&limit=5&page=0`
    );
    const data = res.data;

    if (res.status !== 200) {
      return handleErrorAPI({
        message: data.message || 'Event thumbnails not found',
        status: res.status,
      });
    }
    if (data.statusCode !== 0 || !data.body) {
      return handleErrorAPI({
        message: data.message || 'Invalid response from backend',
        status: 500,
      });
    }

    // Mapping di API route
    const items = (data.body.data || [])
      .map((event: any) => ({
        url: event.eventAssets?.[0]?.asset?.url,
        metaUrl: event.metaUrl,
      }))
      .filter(
        (item: { url: string; metaUrl: string }) => item.url && item.metaUrl
      );

    return NextResponse.json(items);
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
