import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ticket = body.tickets[0];
    const payload = {
      ticketTypeId: ticket.id || ticket.ticketTypeId,
      quantity: ticket.quantity,
    };

    const { data } = await axios.post('/v1/orders', payload);

    return NextResponse.json({
      message: 'Order created successfully',
      success: true,
      data: data.body,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
