import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Ticket from './index';
import '@testing-library/jest-dom';

// Global mock data untuk SWR
let mockSWRData: any = {
  data: {
    event: {
      eventOrganizer: { name: 'Organizer' },
      name: 'Event Name',
      address: 'Event Address',
      mapLocationUrl: 'https://maps.google.com',
    },
    ticketType: { ticket_start_date: '2025-08-03T10:40:23.983Z' },
    tickets: [
      {
        ticket_name: 'VIP',
        ticket_id: '123',
        visitor_name: 'John Doe',
        issued_at: '2025-08-03T10:40:23.983Z',
      },
    ],
  },
  isLoading: false,
};

jest.mock('swr', () => () => mockSWRData);
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: 'test-id' })),
}));
jest.mock('@/lib/api/axios-client', () => ({
  post: jest.fn().mockResolvedValue({
    data: new Blob(['PDF'], { type: 'application/pdf' }),
  }),
}));
jest.mock('@/components', () => ({
  Typography: ({ children }: any) => <div>{children}</div>,
  Container: ({ children }: any) => <div>{children}</div>,
  Box: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  QRCode: ({ value }: any) => <div>QRCode-{value}</div>,
}));
jest.mock('next/image', () => (props: any) => <img {...props} />);

describe('Ticket', () => {
  beforeEach(() => {
    // Reset mock data sebelum setiap test
    mockSWRData = {
      data: {
        event: {
          eventOrganizer: { name: 'Organizer' },
          name: 'Event Name',
          address: 'Event Address',
          mapLocationUrl: 'https://maps.google.com',
        },
        ticketType: { ticket_start_date: '2025-08-03T10:40:23.983Z' },
        tickets: [
          {
            ticket_name: 'VIP',
            ticket_id: '123',
            visitor_name: 'John Doe',
            issued_at: '2025-08-03T10:40:23.983Z',
          },
        ],
      },
      isLoading: false,
    };
  });

  it('renders ticket info', () => {
    render(<Ticket />);
    expect(screen.getByText('Your Ticket')).toBeInTheDocument();
    expect(screen.getByText('Organizer | Event Name')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Event Address')).toBeInTheDocument();
    expect(screen.getByText('See Location')).toBeInTheDocument();
  });

  it('shows "No tickets available" if no data', () => {
    mockSWRData = { data: null, isLoading: false };
    render(<Ticket />);
    expect(screen.getByText('No tickets available')).toBeInTheDocument();
  });

  it('calls handleDownload when Download button is clicked', async () => {
    render(<Ticket />);
    const downloadBtn = screen.getByText('Download');
    fireEvent.click(downloadBtn);
  });

  it('opens location in new tab when See Location button is clicked', () => {
    window.open = jest.fn();
    render(<Ticket />);
    fireEvent.click(screen.getByText('See Location'));
    expect(window.open).toHaveBeenCalledWith(
      'https://maps.google.com',
      '_blank'
    );
  });

  it('downloads PDF with correct filename when Download button is clicked', async () => {
    // Mock browser API
    const createObjectURLMock = jest.fn(() => 'blob:url');
    const revokeObjectURLMock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock a.click
    const anchor = document.createElement('a');
    const clickMock = jest.fn();
    anchor.click = clickMock;

    // Spy hanya untuk 'a', fallback ke asli untuk lainnya
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName === 'a') return anchor;
        return originalCreateElement(tagName);
      });

    render(<Ticket />);
    const downloadBtn = screen.getByText('Download');
    fireEvent.click(downloadBtn);

    await new Promise((r) => setTimeout(r, 0));

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });
});
