import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET(req: NextRequest) {
  try {
    const show = 5;
    const page = 1;
    const res = await axios.get(`/v1/events?show=${show}&page=${page}`);
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
    const items = (data.body.events || [])
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
