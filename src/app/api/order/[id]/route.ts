import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const res = await axios.get(`/v1/orders/${id}`);
    const data = res.data;

    if (res.status !== 200) {
      return handleErrorAPI({
        message: data.message || 'Order not found',
        status: res.status,
      });
    }
    if (!data.order) {
      return handleErrorAPI({
        message: data.message || 'Invalid response from backend',
        status: 500,
      });
    }
    const order = data.order;
    const tickets = [
      {
        id: order.ticketType.id,
        name: order.ticketType.name,
        price: order.group_ticket?.price || order.ticketType.price || 0,
        count: order.quantity,
        partnership_info: order.ticketType.partnership_info || null,
        group_ticket_id: order.group_ticket_id,
        ticket_type_id: order.ticket_type_id,
      },
    ];
    return NextResponse.json({
      ...order,
      tickets,
    });
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
