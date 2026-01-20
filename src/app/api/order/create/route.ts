import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

interface TicketBody {
  ticketTypeId: string;
  groupTicketId?: string;
  quantity: number;
  partnerCode?: string;
}

interface OrderPayload {
  ticketTypeId: string;
  groupTicketId?: string;
  quantity: number;
  partner_code?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ticket: TicketBody = body.tickets[0];
    const payload: OrderPayload = {
      ticketTypeId: ticket.ticketTypeId,
      groupTicketId: ticket.groupTicketId,
      quantity: ticket.quantity,
      partner_code: ticket.partnerCode,
    };

    const { data } = await axios.post('/v1/orders', payload);
    return NextResponse.json({
      message: data.message,
      success: true,
      data: data.order,
    });
  } catch (e: any) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
