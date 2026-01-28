import React from 'react';
import { render, screen } from '@testing-library/react';
import FinancialSection from './index';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('FinancialSection', () => {
  it('renders all financial items correctly', () => {
    render(<FinancialSection />);

    // Header
    expect(screen.getByText(/Transparent and Reliable Financial Reporting/i)).toBeInTheDocument();

    // Items
    expect(screen.getByText(/Competitive Fee/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi Payment Gateway/i)).toBeInTheDocument();
    expect(screen.getByText(/Flexible Withdrawal/i)).toBeInTheDocument();

    // Check descriptions
    expect(screen.getByText(/Enterprise-ready pricing designed to optimize cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Support for multiple secure and trusted payment/i)).toBeInTheDocument();
    expect(screen.getByText(/Flexible fund disbursement options/i)).toBeInTheDocument();
  });
});
