import { NextRequest, NextResponse } from 'next/server';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { formatDate } from '@/utils/formatter';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { ticketTemplate } from '@/lib/templates/ticket-template';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const body = await req.json();

    const tickets = (body.tickets || []).map((ticket: any) => ({
      eventName: body.event?.name,
      eventOrganizerName: body.event?.eventOrganizer?.name,
      type: body.ticketType?.name,
      attendee: ticket.visitor_name,
      qrValue: ticket.id,
      date: formatDate(body.ticketType?.ticketStartDate, 'datetime'),
      address: body.event?.address,
      mapLocation: body.event?.mapLocationUrl,
      ticketType: body.ticketType,
      event: body.event,
      raw: ticket,
    }));

    const template = ticketTemplate;

    // Render HTML dari EJS
    const html = ejs.render(template, { tickets, body });

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', landscape: false });
    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="ticket.pdf"',
      },
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
