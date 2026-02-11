import { render, screen, fireEvent } from '@testing-library/react';
import SummarySection from './index';

// Mocks
jest.mock('next/navigation', () => ({
  usePathname: () => '/event/slug',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/components', () => ({
  Box: ({ children, className }: any) => <div className={className}>{children}</div>,
  Typography: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
  Button: ({ children, onClick, disabled }: any) => <button onClick={onClick} disabled={disabled}>{children}</button>,
}));

// Mock sub-components
jest.mock('./ticket-list', () => () => <div data-testid="ticket-list">Ticket List</div>);
jest.mock('./price-detail', () => () => <div data-testid="price-detail">Price Detail</div>);
jest.mock('./payment-method', () => () => <div data-testid="payment-method">Payment Method</div>);

jest.mock('@/utils/formatter', () => ({
  formatRupiah: (val: number) => `Rp ${val}`,
  calculatePriceWithPartnership: (price: number) => price,
}));

describe('SummarySection', () => {
  const defaultProps = {
    eventData: { adminFee: 1000, tax: 10 },
    tickets: [
      { id: 't1', name: 'Ticket 1', price: '100000', count: 1 }
    ],
    selectedPayment: null,
    setSelectedPayment: jest.fn(),
    onContinue: jest.fn(),
    disabled: false,
    error: '',
  };

  it('renders summary correctly', () => {
    render(<SummarySection {...defaultProps} />);

    expect(screen.getByText('Order details')).toBeInTheDocument();
    expect(screen.getByText('1 Ticket')).toBeInTheDocument();
    // Total: 100000 + 1000 (admin) + 10000 (tax 10%) = 111000 ?
    // Logic: price 100000. tax 10% of 100000 = 10000. admin 1000.
    // Total = 111000.
    expect(screen.getByText('Rp 111000')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
  });

  it('toggles detail view', () => {
    render(<SummarySection {...defaultProps} />);

    const toggleBtn = screen.getByText('See Detail');
    fireEvent.click(toggleBtn);

    expect(screen.getByText('Hide Detail')).toBeInTheDocument();
    expect(screen.getByTestId('price-detail')).toBeInTheDocument();
  });

  it('calls onContinue when button clicked', () => {
    render(<SummarySection {...defaultProps} />);

    const continueBtn = screen.getByText('Continue');
    fireEvent.click(continueBtn);

    expect(defaultProps.onContinue).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(<SummarySection {...defaultProps} error="Payment Failed" />);
    expect(screen.getByText('Payment Failed')).toBeInTheDocument();
  });
});
