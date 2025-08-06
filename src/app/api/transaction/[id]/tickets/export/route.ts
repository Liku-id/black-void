import { NextRequest, NextResponse } from 'next/server';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { formatDate } from '@/utils/formatter';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const tickets = (body.tickets || []).map((ticket: any) => ({
      eventName: body.event?.name,
      eventOrganizerName: body.event?.eventOrganizer?.name,
      type: body.ticketType?.name,
      attendee: ticket.visitor_name,
      qrValue: ticket.ticket_id,
      date: formatDate(body.ticketType?.ticketStartDate, 'datetime'),
      address: body.event?.address,
      mapLocation: body.event?.mapLocationUrl,
      ticketType: body.ticketType,
      event: body.event,
      raw: ticket,
    }));

    // Path ke file EJS template
    const templatePath = path.resolve(
      process.cwd(),
      'src/app/api/transaction/[id]/tickets/export/template.ejs'
    );
    const template = await fs.readFile(templatePath, 'utf-8');

    // Render HTML dari EJS
    const html = ejs.render(template, { tickets, body });

    // Generate PDF pakai Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', landscape: false });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="ticket.pdf"',
      },
    });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
