import { render, screen, fireEvent } from '@testing-library/react';
import TicketInfoCard from './info-card';

// Mocks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('lucide-react', () => ({
  RotateCcw: () => <div data-testid="icon-rotate">Rotate</div>,
}));

describe('TicketInfoCard', () => {
  const mockReset = jest.fn();

  it('renders success status correctly', () => {
    const data = {
      status: 'success' as const,
      visitorName: 'John Doe',
      ticketName: 'VIP Ticket',
      eventDate: '2023-10-10T10:00:00Z',
      ticketId: 'TICKET-123',
    };

    render(<TicketInfoCard data={data} resetScanner={mockReset} />);

    expect(screen.getByText('Ticket Redeemed Successfully')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/VIP Ticket/)).toBeInTheDocument();
  });

  it('renders error status correctly', () => {
    const data = {
      status: 'failed' as const,
      message: 'Ticket not found',
      ticketId: 'INVALID-123'
    };

    render(<TicketInfoCard data={data} resetScanner={mockReset} />);

    expect(screen.getByText('Ticket Redemption Failed')).toBeInTheDocument();
    expect(screen.getByText('Ticket not found')).toBeInTheDocument();
  });

  it('calls resetScanner when button clicked', () => {
    const data = { status: 'success' as const };
    render(<TicketInfoCard data={data} resetScanner={mockReset} />);

    fireEvent.click(screen.getByText('Scan Another Ticket'));
    expect(mockReset).toHaveBeenCalled();
  });
});
