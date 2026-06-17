import { NextRequest, NextResponse } from 'next/server';
import { userAgent } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import { getPostHogClient } from '@/lib/posthog-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Get client IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 2. Get rough geolocation from Vercel headers (or default)
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown City';
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown Country';

    // 3. Parse Browser, Device, and OS from User Agent header safely
    const userAgentHeader = request.headers.get('user-agent') ||
      request.headers.get('User-Agent') ||
      '';
    const ua = userAgent({ headers: new Headers({ 'user-agent': userAgentHeader }) });
    const browser = `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim();
    const os = `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim();
    const deviceType = ua.device.type || 'desktop';

    const tracking = body.tracking || {};

    const payload = {
      orderId: body.orderId,
      paymentMethodId: body.paymentMethodId,
      attendee: body.attendee,
      contactDetails: {
        name: body.contactDetails.name,
        email: body.contactDetails.email,
        phone: body.contactDetails.phone,
      },
      analyticsMetadata: JSON.stringify({
        ipAddress: ip,
        roughLocation: {
          city: city,
          country: country,
        },
        preciseLocation: {
          latitude: tracking.latitude || null,
          longitude: tracking.longitude || null,
        },
        browser: browser,
        deviceType: deviceType,
        os: os,
        referrer: tracking.referrer || null,
        utm: {
          source: tracking.utm_source || null,
          medium: tracking.utm_medium || null,
          campaign: tracking.utm_campaign || null,
          term: tracking.utm_term || null,
          content: tracking.utm_content || null,
        },
      }),
    };

    const { data } = await axios.post('/v1/transactions', payload);

    const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') ?? body.contactDetails?.email ?? 'anonymous';
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId,
      event: 'transaction_created',
      properties: {
        transaction_id: data.transaction.id,
        order_id: body.orderId,
        payment_method_id: body.paymentMethodId,
        $session_id: request.headers.get('X-POSTHOG-SESSION-ID') ?? undefined,
      },
    });

    return NextResponse.json({
      id: data.transaction.id,
      message: data.message,
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e);
  }
}
