import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

interface TicketHistoryItem {
  transaction_id: string;
  event_name: string;
  event_address: string;
  ticket_start_date: string;
  ticket_end_date: string;
}

interface TicketHistoryResponse {
  statusCode: number;
  message: string;
  body: {
    ongoing: TicketHistoryItem[];
    expired: TicketHistoryItem[];
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header if needed
    const authHeader = request.headers.get('authorization');

    const { data } = await axios.get<TicketHistoryResponse>(
      '/v1/ticket/history',
      {
        headers: authHeader ? { Authorization: authHeader } : {},
      }
    );

    return NextResponse.json(data?.body);
  } catch (error) {
    return handleErrorAPI(error as AxiosErrorResponse);
  }
}
