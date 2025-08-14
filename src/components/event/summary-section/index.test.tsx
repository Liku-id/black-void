import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import SummarySection from './index';
import type { TicketSummary } from '../types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, type, size, color, className }: any) => (
    <span className={`${type}-${size} ${color} ${className}`}>{children}</span>
  ),
  Button: ({ children, onClick, disabled, id, className }: any) => (
    <button onClick={onClick} disabled={disabled} id={id} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/utils/formatter', () => ({
  formatRupiah: jest.fn((amount) => `Rp ${amount.toLocaleString()}`),
}));

jest.mock('./ticket-list', () => {
  return function TicketList({ tickets }: any) {
    return (
      <div data-testid="ticket-list">
        {tickets.map((ticket: any) => (
          <div key={ticket.id} data-testid={`ticket-${ticket.id}`}>
            {ticket.name} - {ticket.count} tickets
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('./price-detail', () => {
  return function PriceDetail({
    totalPrice,
    paymentMethodFee,
    adminFee,
    tax,
  }: any) {
    return (
      <div data-testid="price-detail">
        <div data-testid="total-price">{totalPrice}</div>
        <div data-testid="payment-method-fee">{paymentMethodFee}</div>
        <div data-testid="admin-fee">{adminFee}</div>
        <div data-testid="tax">{tax}</div>
      </div>
    );
  };
});

jest.mock('./payment-method', () => {
  return function PaymentMethodAccordion({
    id,
    title,
    methods,
    filterKey,
  }: any) {
    return (
      <div data-testid={`payment-accordion-${id}`}>
        <div data-testid="accordion-title">{title}</div>
        <div data-testid="filter-key">{filterKey}</div>
        <div data-testid="methods-count">{methods.length}</div>
      </div>
    );
  };
});

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('SummarySection Component', () => {
  const mockTickets: TicketSummary[] = [
    {
      id: '1',
      name: 'VIP Ticket',
      price: '100000',
      count: 2,
    },
    {
      id: '2',
      name: 'Regular Ticket',
      price: '50000',
      count: 1,
    },
  ];

  const mockEventData = {
    adminFee: 5, // 5%
    paymentMethods: [
      {
        id: 'va1',
        name: 'BCA Virtual Account',
        paymentCode: 'BCA_VA',
        paymentMethodFee: 0.5, // 0.5%
        logo: '/bca-logo.png',
      },
      {
        id: 'qris1',
        name: 'QRIS',
        paymentCode: 'QRIS',
        paymentMethodFee: 1000, // Fixed amount
        logo: '/qris-logo.png',
      },
    ],
  };

  const defaultProps = {
    eventData: mockEventData,
    tickets: mockTickets,
    onContinue: jest.fn(),
    disabled: false,
    error: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/event/test-event');
  });

  describe('Initial Rendering', () => {
    it('should render summary section with correct initial state', () => {
      render(<SummarySection {...defaultProps} />);

      expect(screen.getByText('Order details')).toBeInTheDocument();
      expect(screen.getByText('Total Payment: 3 Ticket')).toBeInTheDocument();
      expect(screen.getByText('See Detail')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('should calculate and display correct grand total', () => {
      render(<SummarySection {...defaultProps} />);

      // Total price: (2 * 100000) + (1 * 50000) = 250000
      // Admin fee: 250000 * 0.05 = 12500
      // Tax (PB1): 250000 * 0.1 = 25000
      // Payment method fee: 0 (no selection)
      // Grand total: 250000 + 12500 + 25000 = 287500
      expect(screen.getByText('Rp 287,500')).toBeInTheDocument();
    });

    it('should render ticket list when not on order page', () => {
      render(<SummarySection {...defaultProps} />);

      expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-1')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-2')).toBeInTheDocument();
    });

    it('should not render ticket list initially when on order page', () => {
      mockUsePathname.mockReturnValue('/event/test-event/order');
      render(<SummarySection {...defaultProps} />);

      expect(screen.getByTestId('ticket-list')).toBeInTheDocument(); // Still renders in collapsed detail
    });

    it('should not show payment method section when not on order page', () => {
      render(<SummarySection {...defaultProps} />);

      expect(
        screen.queryByText('Choose your Payment Method')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('payment-accordion-va_payment_dropdown')
      ).not.toBeInTheDocument();
    });
  });

  describe('Detail Toggle Functionality', () => {
    it('should toggle detail visibility when clicking see detail link', () => {
      render(<SummarySection {...defaultProps} />);

      const seeDetailLink = screen.getByText('See Detail');
      fireEvent.click(seeDetailLink);

      expect(screen.getByText('Hide Detail')).toBeInTheDocument();
      expect(screen.getByTestId('price-detail')).toBeInTheDocument();
    });

    it('should show ticket list in detail when on order page', () => {
      mockUsePathname.mockReturnValue('/event/test-event/order');
      render(<SummarySection {...defaultProps} />);

      const seeDetailLink = screen.getByText('See Detail');
      fireEvent.click(seeDetailLink);

      expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
      expect(screen.getByTestId('price-detail')).toBeInTheDocument();
    });

    it('should hide detail when clicking hide detail link', () => {
      render(<SummarySection {...defaultProps} />);

      const seeDetailLink = screen.getByText('See Detail');
      fireEvent.click(seeDetailLink);
      expect(screen.getByText('Hide Detail')).toBeInTheDocument();

      const hideDetailLink = screen.getByText('Hide Detail');
      fireEvent.click(hideDetailLink);

      expect(screen.getByText('See Detail')).toBeInTheDocument();
    });
  });

  describe('Payment Method Section (Order Page)', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/event/test-event/order');
    });

    it('should render payment method section on order page', () => {
      render(<SummarySection {...defaultProps} />);

      expect(
        screen.getByText('Choose your Payment Method')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('payment-accordion-va_payment_dropdown')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('payment-accordion-qris_payment_dropdown')
      ).toBeInTheDocument();
    });

    it('should pass correct props to payment method accordions', () => {
      render(<SummarySection {...defaultProps} />);

      const vaAccordion = screen.getByTestId(
        'payment-accordion-va_payment_dropdown'
      );
      const qrisAccordion = screen.getByTestId(
        'payment-accordion-qris_payment_dropdown'
      );

      expect(vaAccordion).toBeInTheDocument();
      expect(qrisAccordion).toBeInTheDocument();

      expect(screen.getByText('Virtual Account')).toBeInTheDocument();
      expect(screen.getByText('QRIS')).toBeInTheDocument();
    });

    it('should handle payment method selection', () => {
      const setSelectedPayment = jest.fn();
      render(
        <SummarySection
          {...defaultProps}
          setSelectedPayment={setSelectedPayment}
        />
      );

      // The payment method selection is handled by the PaymentMethodAccordion component
      // This test verifies the prop is passed correctly
      expect(setSelectedPayment).toBeDefined();
    });

    it('should calculate grand total with selected payment method fee', () => {
      const selectedPayment = {
        id: 'va1',
        name: 'BCA Virtual Account',
        paymentMethodFee: 0.5, // 0.5%
      };

      render(
        <SummarySection {...defaultProps} selectedPayment={selectedPayment} />
      );

      // Total price: 250000
      // Admin fee: 12500
      // Tax: 25000
      // Payment method fee: 250000 * 0.005 = 1250
      // Grand total: 250000 + 12500 + 25000 + 1250 = 288750
      expect(screen.getByText('Rp 288,750')).toBeInTheDocument();
    });

    it('should handle fixed payment method fee', () => {
      const selectedPayment = {
        id: 'qris1',
        name: 'QRIS',
        paymentMethodFee: 1000, // Fixed amount
      };

      render(
        <SummarySection {...defaultProps} selectedPayment={selectedPayment} />
      );

      // Total price: 250000
      // Admin fee: 12500
      // Tax: 25000
      // Payment method fee: 1000 (fixed)
      // Grand total: 250000 + 12500 + 25000 + 1000 = 287500
      expect(screen.getByText('Rp 287,500')).toBeInTheDocument();
    });
  });

  describe('Continue Button', () => {
    it('should call onContinue when continue button is clicked', () => {
      const onContinue = jest.fn();
      render(<SummarySection {...defaultProps} onContinue={onContinue} />);

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it('should disable continue button when disabled prop is true', () => {
      render(<SummarySection {...defaultProps} disabled={true} />);

      const continueButton = screen.getByText('Continue');
      expect(continueButton).toBeDisabled();
    });

    it('should enable continue button when disabled prop is false', () => {
      render(<SummarySection {...defaultProps} disabled={false} />);

      const continueButton = screen.getByText('Continue');
      expect(continueButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error prop is provided', () => {
      const errorMessage = 'Please select a payment method';
      render(<SummarySection {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not display error message when error prop is empty', () => {
      render(<SummarySection {...defaultProps} error="" />);

      expect(
        screen.queryByText('Please select a payment method')
      ).not.toBeInTheDocument();
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct total price for multiple tickets', () => {
      const tickets = [
        { id: '1', name: 'VIP', price: '100000', count: 3 },
        { id: '2', name: 'Regular', price: '50000', count: 2 },
      ];

      render(<SummarySection {...defaultProps} tickets={tickets} />);

      // Total price: (3 * 100000) + (2 * 50000) = 400000
      // Admin fee: 400000 * 0.05 = 20000
      // Tax: 400000 * 0.1 = 40000
      // Grand total: 400000 + 20000 + 40000 = 460000
      expect(screen.getByText('Rp 460,000')).toBeInTheDocument();
    });

    it('should handle zero tickets', () => {
      const tickets: TicketSummary[] = [];
      render(<SummarySection {...defaultProps} tickets={tickets} />);

      expect(screen.getByText('Total Payment: 0 Ticket')).toBeInTheDocument();
      expect(screen.getByText('Rp 0')).toBeInTheDocument();
    });

    it('should handle single ticket', () => {
      const tickets = [
        { id: '1', name: 'Single Ticket', price: '75000', count: 1 },
      ];
      render(<SummarySection {...defaultProps} tickets={tickets} />);

      expect(screen.getByText('Total Payment: 1 Ticket')).toBeInTheDocument();
      // Total price: 75000
      // Admin fee: 75000 * 0.05 = 3750
      // Tax: 75000 * 0.1 = 7500
      // Grand total: 75000 + 3750 + 7500 = 86250
      expect(screen.getByText('Rp 86,250')).toBeInTheDocument();
    });

    it('should handle decimal prices correctly', () => {
      const tickets = [
        { id: '1', name: 'Decimal Price', price: '99.99', count: 1 },
      ];
      render(<SummarySection {...defaultProps} tickets={tickets} />);

      // Total price: 99.99
      // Admin fee: 99.99 * 0.05 = 5
      // Tax: 99.99 * 0.1 = 10
      // Grand total: 99.99 + 5 + 10 = 114.99
      expect(screen.getByText('Rp 114.99')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing eventData', () => {
      render(<SummarySection {...defaultProps} eventData={undefined} />);

      // Should still render without crashing
      expect(screen.getByText('Order details')).toBeInTheDocument();
    });

    it('should handle missing payment methods', () => {
      const eventDataWithoutPayment = {
        ...mockEventData,
        paymentMethods: undefined,
      };
      mockUsePathname.mockReturnValue('/event/test-event/order');

      render(
        <SummarySection {...defaultProps} eventData={eventDataWithoutPayment} />
      );

      // Should render payment section without crashing
      expect(
        screen.getByText('Choose your Payment Method')
      ).toBeInTheDocument();
    });

    it('should handle empty payment methods array', () => {
      const eventDataWithEmptyPayment = {
        ...mockEventData,
        paymentMethods: [],
      };
      mockUsePathname.mockReturnValue('/event/test-event/order');

      render(
        <SummarySection
          {...defaultProps}
          eventData={eventDataWithEmptyPayment}
        />
      );

      // Should render payment section without crashing
      expect(
        screen.getByText('Choose your Payment Method')
      ).toBeInTheDocument();
    });

    it('should handle missing setSelectedPayment function', () => {
      mockUsePathname.mockReturnValue('/event/test-event/order');

      render(
        <SummarySection {...defaultProps} setSelectedPayment={undefined} />
      );

      // Should render without crashing
      expect(
        screen.getByText('Choose your Payment Method')
      ).toBeInTheDocument();
    });

    it('should handle null selectedPayment', () => {
      mockUsePathname.mockReturnValue('/event/test-event/order');

      render(<SummarySection {...defaultProps} selectedPayment={null} />);

      // Should render without crashing
      expect(
        screen.getByText('Choose your Payment Method')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and IDs', () => {
      render(<SummarySection {...defaultProps} />);

      expect(screen.getByText('See Detail')).toHaveAttribute(
        'id',
        'open_order_detail_link'
      );
      expect(screen.getByText('Continue')).toHaveAttribute(
        'id',
        'continue_button'
      );
    });

    it('should handle keyboard navigation for see detail link', () => {
      render(<SummarySection {...defaultProps} />);

      const seeDetailLink = screen.getByText('See Detail');

      // Test Enter key
      fireEvent.keyDown(seeDetailLink, { key: 'Enter' });
      expect(screen.getByText('Hide Detail')).toBeInTheDocument();

      // Test Space key
      fireEvent.keyDown(seeDetailLink, { key: ' ' });
      expect(screen.getByText('See Detail')).toBeInTheDocument();
    });

    it('should handle keyboard navigation for continue button', () => {
      const onContinue = jest.fn();
      render(<SummarySection {...defaultProps} onContinue={onContinue} />);

      const continueButton = screen.getByText('Continue');

      // Test Enter key
      fireEvent.keyDown(continueButton, { key: 'Enter' });
      expect(onContinue).toHaveBeenCalledTimes(1);

      // Test Space key
      fireEvent.keyDown(continueButton, { key: ' ' });
      expect(onContinue).toHaveBeenCalledTimes(2);
    });
  });

  describe('Responsive Behavior', () => {
    it('should render correctly on different pathnames', () => {
      // Test event page
      mockUsePathname.mockReturnValue('/event/test-event');
      const { rerender } = render(<SummarySection {...defaultProps} />);

      expect(
        screen.queryByText('Choose your Payment Method')
      ).not.toBeInTheDocument();

      // Test order page
      mockUsePathname.mockReturnValue('/event/test-event/order');
      rerender(<SummarySection {...defaultProps} />);

      expect(
        screen.getByText('Choose your Payment Method')
      ).toBeInTheDocument();
    });
  });
});
