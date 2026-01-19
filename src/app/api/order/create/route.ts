import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

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
    return NextResponse.json({
      message: data.message,
      success: true,
      data: data.order,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
