import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

interface Ticket {
  id: string;
  ticket_type_id: string;
  transaction_id: string;
  ticket_id: string;
  ticket_name: string;
  visitor_name: string;
  ticket_status: string;
  issued_at: string;
  redeemed_at: string;
  checked_in_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface ListTicketsResponse {
  statusCode: number;
  message: string;
  body: {
    tickets: Ticket[];
    show: number;
    page: number;
    total: string;
    totalPage: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Required parameter
    const eventId = searchParams.get('eventId');
    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      );
    }

    // Optional parameters with defaults
    const page = parseInt(searchParams.get('page') || '0');
    const show = parseInt(searchParams.get('show') || '10');
    const search = searchParams.get('search');

    // Handle ticketTypeIds array parameter
    const ticketTypeIds = searchParams.getAll('ticketTypeIds');

    // Build query parameters
    const queryParams = new URLSearchParams({
      eventId,
      page: page.toString(),
      show: show.toString(),
    });

    if (search) {
      queryParams.append('search', search);
    }

    // Add multiple ticketTypeIds if provided
    ticketTypeIds.forEach(id => {
      queryParams.append('ticketTypeIds', id);
    });

    // Get authorization header if needed
    const authHeader = request.headers.get('authorization');

    const { data } = await axios.get<ListTicketsResponse>(
      `/v1/tickets?${queryParams.toString()}`,
      {
        headers: authHeader ? { Authorization: authHeader } : {},
      }
    );

    return NextResponse.json({
      message: 'Tickets retrieved successfully',
      success: true,
      data: data.body,
    });
  } catch (error) {
    return handleErrorAPI(error as AxiosErrorResponse);
  }
}
