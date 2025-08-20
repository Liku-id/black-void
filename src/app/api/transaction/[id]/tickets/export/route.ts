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

    const html = ejs.render(ticketTemplate, { tickets, body });

    const enableSingleProcess = process.env.CHROME_SINGLE_PROCESS === 'true';

    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-proxy-server',
      '--proxy-bypass-list=*',
    ];

    if (enableSingleProcess) {
      args.push('--single-process', '--no-zygote');
    }

    browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args,
      timeout: 60_000,
    });

    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    });

    const eventName = (body.event?.name || 'ticket').replace(/\s+/g, '_');
    const eventDate = body?.ticketType?.ticketStartDate
      ? formatDate(body.ticketType.ticketStartDate, 'date')
      : 'download';
    const fileName = `${eventName}-${eventDate}.pdf`;

    return new NextResponse(new Uint8Array(pdf).buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
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
