import { render, screen, fireEvent } from '@testing-library/react';
import TicketListSection from './index';

// Mocks
jest.mock('@/components', () => ({
  Typography: ({ children }: any) => <span>{children}</span>,
  Box: ({ children, onClick, id }: any) => <div id={id} onClick={onClick}>{children}</div>,
}));

jest.mock('../ticket-card', () => ({ ticket, count }: any) => (
  <div data-testid="ticket-card">
    {ticket.name} - Count: {count}
  </div>
));

jest.mock('@/utils/formatter', () => ({
  formatDate: (date: string) => date,
}));

describe('TicketListSection', () => {
  const mockHandleChange = jest.fn();
  const tickets = [
    {
      id: 't1',
      name: 'Day 1 Ticket',
      ticket_start_date: '2023-12-01',
      count: 0,
      price: 100,
      quantity: 10,
      purchased_amount: 0
    },
    {
      id: 't2',
      name: 'Day 2 Ticket',
      ticket_start_date: '2023-12-02',
      count: 0,
      price: 100,
      quantity: 10,
      purchased_amount: 0
    }
  ];

  it('renders ticket dates tabs', () => {
    render(<TicketListSection tickets={tickets} handleChangeCount={mockHandleChange} />);

    expect(screen.getAllByText(/2023-12-01/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/2023-12-02/)[0]).toBeInTheDocument();
  });

  it('renders tickets for selected date', () => {
    render(<TicketListSection tickets={tickets} handleChangeCount={mockHandleChange} />);
    // Default selects first date (2023-12-01)
    expect(screen.getByText(/Day 1 Ticket/)).toBeInTheDocument();
    expect(screen.queryByText(/Day 2 Ticket/)).not.toBeInTheDocument();
  });

  it('switches date when tab clicked', () => {
    render(<TicketListSection tickets={tickets} handleChangeCount={mockHandleChange} />);

    const day2Tab = document.getElementById('event_date_2023-12-02_tab');
    fireEvent.click(day2Tab!);

    expect(screen.getByText(/Day 2 Ticket/)).toBeInTheDocument();
    expect(screen.queryByText(/Day 1 Ticket/)).not.toBeInTheDocument();
  });
});
