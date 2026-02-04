import axios from '@/lib/api/axios-server';

export async function getCarouselData() {
  try {
    const res = await axios.get(
      `/v1/events?status=EVENT_STATUS_ON_GOING&status=EVENT_STATUS_APPROVED&status=EVENT_STATUS_DONE&limit=5&page=0`
    );
    const data = res.data;

    if (res.status !== 200 || data.statusCode !== 0 || !data.body) {
      return [];
    }

    return (data.body.data || [])
      .map((event: any) => ({
        url: event.eventAssets?.[0]?.asset?.url,
        metaUrl: event.metaUrl,
      }))
      .filter(
        (item: { url: string; metaUrl: string }) => item.url && item.metaUrl
      );
  } catch (error) {
    console.error('Error fetching carousel data:', error);
    return [];
  }
}
