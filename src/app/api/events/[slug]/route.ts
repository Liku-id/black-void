import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';
import { encryptUtils } from '@/lib/utils/encryptUtils';
import { calculatePriceWithPartnership, formatRupiah } from '@/utils/formatter';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(req.url);
    const partnerCode = searchParams.get('partner_code');
    const previewToken = req.cookies.get('preview_token')?.value;

    // Build query string for backend API
    const queryParams = new URLSearchParams();
    if (partnerCode) {
      queryParams.append('partner_code', partnerCode);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/v1/events/${slug}?${queryString}`
      : `/v1/events/${slug}`;

    // Decrypt preview_token and use as Authorization header
    const config: { headers?: Record<string, string> } = {};
    if (previewToken) {
      try {
        // Decrypt the preview token to get the actual access token
        const decryptedToken = encryptUtils.decrypt(previewToken);
        config.headers = {
          Authorization: `Bearer ${decryptedToken}`
        };
      } catch (error) {
        console.error('Error decrypting preview_token:', error);
        // If decryption fails, try using it as-is (backward compatibility)
        config.headers = {
          Authorization: `Bearer ${previewToken}`
        };
      }
    }

    const res = await axios.get(url, config);
    const data = res.data;

    if (res.status !== 200) {
      return handleErrorAPI({
        message: data.message || 'Event not found',
        status: res.status,
      });
    }
    if (data.statusCode !== 0 || !data.body) {
      return handleErrorAPI({
        message: data.message || 'Invalid response from backend',
        status: 500,
      });
    }
    const minPrice = (() => {
      if (!data.body.ticketTypes || data.body.ticketTypes.length === 0) {
        return null;
      }
      const prices = data.body.ticketTypes.map((ticket: any) => {
        const basePrice = Number(ticket.price);
        return calculatePriceWithPartnership(basePrice, ticket.partnership_info);
      });
      return Math.min(...prices);
    })();

    data.body.lowestTicketPrice = minPrice !== null
      ? formatRupiah(minPrice)
      : null;

    // Merging Tickets
    const singleTickets = (data.body.ticketTypes || [])
      .filter((t: any) => t.is_public !== false)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        count: 0,
        max_order_quantity: t.max_order_quantity,
        description: t.description,
        sales_start_date: t.sales_start_date,
        sales_end_date: t.sales_end_date,
        ticket_start_date: t.ticketStartDate,
        quantity: t.quantity,
        purchased_amount: t.purchased_amount,
        partnership_info: t.partnership_info || null,
      }));

    const groupTickets = (data.body.group_tickets || []).map((gt: any) => {
      const ticketType = gt.ticket_type;
      const ticketStartDate = ticketType
        ? ticketType.ticketStartDate || ticketType.ticket_start_date
        : undefined;

      return {
        id: gt.id,
        name: gt.name,
        price: gt.price,
        count: 0,
        max_order_quantity: gt.max_order_quantity,
        description: gt.description || `Bundle of ${gt.bundle_quantity} tickets`,
        sales_start_date: gt.sales_start_date,
        sales_end_date: gt.sales_end_date,
        ticket_start_date: ticketStartDate,
        quantity: gt.quantity,
        purchased_amount: gt.purchased_amount || 0,
        partnership_info: null,
        group_ticket_id: gt.id,
        ticket_type_id: gt.ticket_type_id,
      };
    });

    data.body.available_tickets = [...singleTickets, ...groupTickets];

    return NextResponse.json(data.body);
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
