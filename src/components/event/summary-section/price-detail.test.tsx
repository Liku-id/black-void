import { render, screen } from '@testing-library/react';
import PriceDetail from './price-detail';

jest.mock('@/utils/formatter', () => ({
  formatRupiah: (val: number) => `Rp ${val}`,
}));

jest.mock('@/components', () => ({
  Box: ({ children, className }: any) => <div className={className}>{children}</div>,
  Typography: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('PriceDetail', () => {
  const props = {
    totalPrice: 100000,
    paymentMethodFee: 5000,
    adminFee: 2000,
    tax: 11000,
  };

  it('renders all price components correctly', () => {
    render(<PriceDetail {...props} />);

    expect(screen.getByText('Price Detail')).toBeInTheDocument();

    expect(screen.getByText('Ticket Price')).toBeInTheDocument();
    expect(screen.getByText('Rp 100000')).toBeInTheDocument();

    expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
    expect(screen.getByText('Rp 5000')).toBeInTheDocument();

    expect(screen.getByText('Admin Fee')).toBeInTheDocument();
    expect(screen.getByText('Rp 2000')).toBeInTheDocument();

    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('Rp 11000')).toBeInTheDocument();
  });
});
