import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

interface UpdateTicketRequest {
  ticketStatus: 'redeemed' | 'checked_in';
}

interface RouteParams {
  params: {
    ticketId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { ticketId } = await params;

    // Get authorization header
    const authHeader = request.headers.get('authorization');

    const { data } = await axios.get(`/v1/tickets/${ticketId}`, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    return NextResponse.json({
      message: 'Ticket retrieved successfully',
      success: true,
      data: data?.body,
    });
  } catch (error) {
    return handleErrorAPI(error as AxiosErrorResponse);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { ticketId } = await params;
    const body = await request.json();

    // Validate request body
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');

    const requestData: UpdateTicketRequest = {
      ticketStatus: body.status,
    };

    const { data } = await axios.put(`/v1/tickets/${ticketId}`, requestData, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    return NextResponse.json({
      message: 'Ticket updated successfully',
      success: true,
      data: data?.body,
    });
  } catch (error) {
    return handleErrorAPI(error as AxiosErrorResponse);
  }
}
