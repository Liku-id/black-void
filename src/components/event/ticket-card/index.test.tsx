import { render, screen, fireEvent } from '@testing-library/react';
import TicketCard from './index';

// Mocks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/components', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  Typography: ({ children, dangerouslySetInnerHTML }: any) => (
    <span dangerouslySetInnerHTML={dangerouslySetInnerHTML}>{children}</span>
  ),
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

jest.mock('@/utils/formatter', () => ({
  formatRupiah: (price: number) => `Rp ${price}`,
  formatStrToHTML: (str: string) => str,
  formatDate: (date: string) => date,
  getTodayWIB: () => new Date('2023-01-01T00:00:00Z'),
  convertToWIB: (date: string) => new Date(date),
  calculatePriceWithPartnership: (price: number) => price,
}));

describe('TicketCard', () => {
  const mockOnChange = jest.fn();
  const baseTicket = {
    id: 't1',
    name: 'VIP Ticket',
    price: 100000,
    count: 0,
    quantity: 10,
    purchased_amount: 0,
    description: 'A VIP ticket',
    sales_start_date: '2022-01-01T00:00:00Z', // Past
    sales_end_date: '2024-01-01T00:00:00Z', // Future
  };

  it('renders ticket details', () => {
    render(
      <TicketCard
        ticket={baseTicket}
        count={0}
        onChange={mockOnChange}
        isActive={false}
        isOtherActive={false}
      />
    );

    expect(screen.getByText('VIP Ticket')).toBeInTheDocument();
    expect(screen.getByText('Rp 100000')).toBeInTheDocument();
    expect(screen.getByText('A VIP ticket')).toBeInTheDocument();
  });

  it('calls onChange when plus button clicked', () => {
    render(
      <TicketCard
        ticket={baseTicket}
        count={0}
        onChange={mockOnChange}
        isActive={false}
        isOtherActive={false}
      />
    );

    fireEvent.click(screen.getByText('+'));
    expect(mockOnChange).toHaveBeenCalledWith('t1', 1);
  });

  it('disables minus button when count is 0', () => {
    render(
      <TicketCard
        ticket={baseTicket}
        count={0}
        onChange={mockOnChange}
        isActive={false}
        isOtherActive={false}
      />
    );

    const minusBtn = screen.getByText('-');
    expect(minusBtn).toBeDisabled();
  });

  it('shows sold out state', () => {
    const soldTicket = { ...baseTicket, purchased_amount: 10, quantity: 10 };
    render(
      <TicketCard
        ticket={soldTicket}
        count={0}
        onChange={mockOnChange}
        isActive={false}
        isOtherActive={false}
      />
    );

    expect(screen.getByText('SOLD')).toBeInTheDocument();
  });
});
