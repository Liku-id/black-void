import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Ticket from './index';

// Mocks
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '123' }),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: () => 'data:image/png;base64,mock',
  height: 100,
  width: 100,
})));

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
    addPage: jest.fn(),
  }));
});

// Mock components
jest.mock('@/components', () => ({
  Typography: ({ children }: any) => <span>{children}</span>,
  Container: ({ children }: any) => <div>{children}</div>,
  Box: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  QRCode: () => <div data-testid="qrcode">QRCode</div>,
}));

// Mock Loading
jest.mock('../../layout/loading', () => () => <div data-testid="loading">Loading...</div>);

describe('TicketDetail', () => {
  it('renders loading state', () => {
    const useSWR = require('swr').default;
    useSWR.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<Ticket type="transaction" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders no tickets state', () => {
    const useSWR = require('swr').default;
    useSWR.mockReturnValue({
      data: { tickets: [] },
      isLoading: false,
    });

    render(<Ticket type="transaction" />);
    expect(screen.getByText('No tickets available')).toBeInTheDocument();
  });

  it('renders tickets correctly', () => {
    const useSWR = require('swr').default;
    useSWR.mockReturnValue({
      data: {
        event: {
          name: 'Event Name',
          eventOrganizer: { name: 'Organizer' },
          address: 'Event Address',
          mapLocationUrl: 'http://maps.google.com',
        },
        tickets: [
          { id: 't1', visitor_name: 'Visitor 1' },
          { id: 't2', visitor_name: 'Visitor 2' },
        ],
        ticketType: {
          name: 'VIP',
          ticketStartDate: '2023-12-01T10:00:00Z',
        },
        group_ticket: null,
      },
      isLoading: false,
    });

    render(<Ticket type="transaction" />);

    expect(screen.getByText('Your Ticket')).toBeInTheDocument();
    expect(screen.getByText(/Organizer/)).toBeInTheDocument();
    expect(screen.getByText(/Event Name/)).toBeInTheDocument();
    expect(screen.getByText('Visitor 1')).toBeInTheDocument();
    expect(screen.getByText('Visitor 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('qrcode')).toHaveLength(2);
  });

  it('handles download', async () => {
    const useSWR = require('swr').default;
    useSWR.mockReturnValue({
      data: {
        event: { name: 'Event' },
        tickets: [{ id: 't1', visitor_name: 'V1' }],
        ticketType: { name: 'VIP', ticketStartDate: '2023-12-01' },
      },
      isLoading: false,
    });

    render(<Ticket type="transaction" />);

    const downloadBtn = screen.getByText('Download');
    fireEvent.click(downloadBtn);

    // Since html2canvas/jspdf are mocked, we just check if flow proceeds without error
    // Ideally check if mocks are called, but component internal logic is complex.
    // We assume if it doesn't crash, it's mostly fine for this unit test level.
    await waitFor(() => {
      expect(require('jspdf')).toHaveBeenCalled();
    });
  });
});
