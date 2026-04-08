import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import { getPostHogClient } from '@/lib/posthog-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload = {
      orderId: body.orderId,
      paymentMethodId: body.paymentMethodId,
      attendee: body.attendee,
      contactDetails: {
        name: body.contactDetails.name,
        email: body.contactDetails.email,
        phone: body.contactDetails.phone,
      },
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
