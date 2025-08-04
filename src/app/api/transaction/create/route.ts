import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

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
    return NextResponse.json({
      id: data.transaction.id,
      message: data.message,
      success: true,
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
