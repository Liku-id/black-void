import { render, screen } from '@testing-library/react';
import TicketList from './ticket-list';

// Mock formatters
jest.mock('@/utils/formatter', () => ({
  formatRupiah: (val: number) => `Rp ${val}`,
  calculatePriceWithPartnership: (price: number, info: any) => price, // Simplified for test
}));

jest.mock('@/components', () => ({
  Box: ({ children, className }: any) => <div className={className}>{children}</div>,
  Typography: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('TicketList', () => {
  const mockTickets = [
    { id: '1', name: 'VIP Ticket', count: 2, price: '100000', partnership_info: null },
    { id: '2', name: 'Regular Ticket', count: 1, price: '50000', partnership_info: null },
  ];

  it('renders list of tickets', () => {
    render(<TicketList tickets={mockTickets} />);

    expect(screen.getByText('VIP Ticket')).toBeInTheDocument();
    expect(screen.getByText('Total: 2 Tickets')).toBeInTheDocument();
    // Subtotal: 2 * 100000 = 200000 -> Rp 200000
    expect(screen.getByText('Rp 200000')).toBeInTheDocument();

    expect(screen.getByText('Regular Ticket')).toBeInTheDocument();
    expect(screen.getByText('Total: 1 Tickets')).toBeInTheDocument();
    expect(screen.getByText('Rp 50000')).toBeInTheDocument();
  });

  it('renders empty list gracefully', () => {
    render(<TicketList tickets={[]} />);
    // The component renders a wrapper div. If list is empty, it's just <div class="..."></div>
    // We can check if it has no text content or specific children
    expect(screen.queryByText(/Ticket/)).not.toBeInTheDocument();
  });
});
