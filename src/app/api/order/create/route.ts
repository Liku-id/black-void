import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import { getPostHogClient } from '@/lib/posthog-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ticket = body.tickets[0];
    const payload: any = {
      ticketTypeId: ticket.ticketTypeId,
      groupTicketId: ticket.groupTicketId,
      quantity: ticket.quantity,
      partner_code: ticket.partnerCode,
    };

    const { data } = await axios.post('/v1/orders', payload);

    const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') ?? data.order?.id ?? 'anonymous';
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId,
      event: 'order_created',
      properties: {
        order_id: data.order?.id,
        ticket_type_id: ticket.ticketTypeId,
        quantity: ticket.quantity,
        has_partner_code: Boolean(ticket.partnerCode),
        $session_id: request.headers.get('X-POSTHOG-SESSION-ID') ?? undefined,
      },
    });

    return NextResponse.json({
      message: data.message,
      success: true,
      data: data.order,
    });
  } catch (e) {
    return handleErrorAPI(e);
  }
}
