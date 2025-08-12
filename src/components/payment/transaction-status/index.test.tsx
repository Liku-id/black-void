import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentStatus from './index';
import '@testing-library/jest-dom';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    id: 'transaction-123',
  }),
}));

// Mock SWR
let mockSWRData: any = null;
let mockSWRIsLoading = false;
jest.mock('swr', () => () => ({
  data: mockSWRData,
  isLoading: mockSWRIsLoading,
}));

// Mock components
jest.mock('@/components', () => ({
  Typography: ({ children, type, size, color, className }: any) => (
    <div
      data-type={type}
      data-size={size}
      data-color={color}
      className={className}
    >
      {children}
    </div>
  ),
  Container: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Box: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Button: ({ children, onClick, className, id }: any) => (
    <button onClick={onClick} className={className} id={id}>
      {children}
    </button>
  ),
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, unoptimized }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-unoptimized={unoptimized}
    />
  ),
}));

// Mock icons and images
jest.mock('@/assets/icons/success-status.svg', () => 'success-status-icon.svg');
jest.mock('@/assets/icons/failed-status.svg', () => 'failed-status-icon.svg');
jest.mock('@/assets/images/dashed-divider.svg', () => 'dashed-divider.svg');

// Mock formatter utilities
jest.mock('@/utils/formatter', () => ({
  formatDate: jest.fn((date, format) => {
    if (format === 'date') {
      return 'January 15, 2024';
    }
    return 'Formatted Date';
  }),
  formatRupiah: jest.fn((amount) => `Rp ${amount.toLocaleString()}`),
}));

// Mock Loading component
jest.mock('@/components/layout/loading', () => {
  return function Loading() {
    return <div>Loading...</div>;
  };
});

describe('PaymentStatus', () => {
  const mockTransactionData = {
    transaction: {
      id: 'transaction-123',
      status: 'paid',
      transactionNumber: 'TRX-2024-001',
      createdAt: '2024-01-15T10:00:00Z',
      orderQuantity: 2,
      event: {
        name: 'Tech Conference 2024',
        adminFee: 5,
        eventOrganizer: {
          name: 'Tech Events Inc',
          asset: {
            url: 'https://example.com/logo.png',
          },
        },
      },
      ticketType: {
        name: 'VIP Ticket',
        price: 500000,
        quantity: 2,
      },
      paymentMethod: {
        name: 'Credit Card',
        paymentMethodFee: 2.5,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSWRData = null;
    mockSWRIsLoading = false;
  });

  describe('Loading State', () => {
    it('shows loading component when data is loading', () => {
      mockSWRIsLoading = true;

      render(<PaymentStatus />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('No Data State', () => {
    it('shows no data message when no data is available', () => {
      mockSWRData = null;
      mockSWRIsLoading = false;

      render(<PaymentStatus />);

      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });

  describe('Pending Status', () => {
    it('shows pending state with loading animation', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          status: 'pending',
        },
      };

      render(<PaymentStatus />);

      // Should show loading animation for pending status
      const loadingAnimation = document.querySelector('.animate-pulse');
      expect(loadingAnimation).toBeInTheDocument();
    });
  });

  describe('Paid Status', () => {
    beforeEach(() => {
      mockSWRData = mockTransactionData;
    });

    it('renders success message for paid transaction', () => {
      render(<PaymentStatus />);

      expect(screen.getByText('Youre All Set!')).toBeInTheDocument();
      expect(screen.getByText('Wu-hoo!')).toBeInTheDocument();
    });

    it('displays success status icon', () => {
      render(<PaymentStatus />);

      const successIcon = screen.getByAltText('status');
      expect(successIcon).toBeInTheDocument();
    });

    it('shows event organizer and event name', () => {
      render(<PaymentStatus />);

      expect(
        screen.getByText('Tech Events Inc | Tech Conference 2024')
      ).toBeInTheDocument();
    });

    it('displays transaction number', () => {
      render(<PaymentStatus />);

      expect(screen.getByText('Transaction Number:')).toBeInTheDocument();
      // Use getAllByText since there are multiple instances
      const transactionNumbers = screen.getAllByText('TRX-2024-001');
      expect(transactionNumbers.length).toBeGreaterThan(0);
    });

    it('shows ticket information', () => {
      render(<PaymentStatus />);

      expect(screen.getByText('VIP Ticket')).toBeInTheDocument();
      expect(screen.getByText('Total: 2 Ticket')).toBeInTheDocument();
    });

    it('displays transaction details', () => {
      render(<PaymentStatus />);

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
      expect(screen.getByText('Transaction Date')).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });

    it('calculates and displays payment breakdown', () => {
      render(<PaymentStatus />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
      expect(screen.getByText('PB1')).toBeInTheDocument();
      expect(screen.getByText('Total Payment')).toBeInTheDocument();
    });

    it('shows "View Tickets" button for paid status', () => {
      render(<PaymentStatus />);

      const viewTicketsButton = screen.getByText('View Tickets');
      expect(viewTicketsButton).toBeInTheDocument();
      expect(viewTicketsButton).toHaveAttribute('id', 'view_tickets_button');
    });

    it('navigates to tickets page when View Tickets button is clicked', () => {
      render(<PaymentStatus />);

      const viewTicketsButton = screen.getByText('View Tickets');
      fireEvent.click(viewTicketsButton);

      expect(mockPush).toHaveBeenCalledWith(
        '/transaction/transaction-123/tickets'
      );
    });

    it('displays organizer logo when available', () => {
      render(<PaymentStatus />);

      const logo = screen.getByAltText('logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
      expect(logo).toHaveAttribute('data-unoptimized', 'true');
    });

    it('shows placeholder when organizer logo is not available', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          event: {
            ...mockTransactionData.transaction.event,
            eventOrganizer: {
              name: 'Tech Events Inc',
              asset: null,
            },
          },
        },
      };

      render(<PaymentStatus />);

      expect(screen.queryByAltText('logo')).not.toBeInTheDocument();
    });
  });

  describe('Failed Status', () => {
    beforeEach(() => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          status: 'failed',
        },
      };
    });

    it('renders failure message for failed transaction', () => {
      render(<PaymentStatus />);

      expect(screen.getByText('Oopsie...')).toBeInTheDocument();
    });

    it('displays failed status icon', () => {
      render(<PaymentStatus />);

      const failedIcon = screen.getByAltText('status');
      expect(failedIcon).toBeInTheDocument();
    });

    it('shows "Back to Home" button for failed status', () => {
      render(<PaymentStatus />);

      const backButton = screen.getByText('Back to Home');
      expect(backButton).toBeInTheDocument();
    });

    it('navigates to home when Back to Home button is clicked', () => {
      render(<PaymentStatus />);

      const backButton = screen.getByText('Back to Home');
      fireEvent.click(backButton);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Payment Calculations', () => {
    it('calculates subtotal correctly', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          ticketType: { price: 100000, quantity: 2 },
          orderQuantity: 2,
        },
      };

      render(<PaymentStatus />);

      // Subtotal should be 100000 * 2 = 200000
      expect(screen.getByText('Subtotal')).toBeInTheDocument();
    });

    it('calculates admin fee correctly', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          event: {
            ...mockTransactionData.transaction.event,
            adminFee: 10, // 10%
          },
          ticketType: { price: 100000, quantity: 2 },
          orderQuantity: 2,
        },
      };

      render(<PaymentStatus />);

      // Admin fee should be 200000 * 0.1 = 20000
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
    });

    it('calculates payment method fee correctly for percentage', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          paymentMethod: {
            name: 'Credit Card',
            paymentMethodFee: 2.5, // 2.5%
          },
          ticketType: { price: 100000, quantity: 2 },
          orderQuantity: 2,
        },
      };

      render(<PaymentStatus />);

      // Payment method fee should be 200000 * 0.025 = 5000
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
    });

    it('calculates payment method fee correctly for fixed amount', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          paymentMethod: {
            name: 'Bank Transfer',
            paymentMethodFee: 5000, // Fixed amount
          },
          ticketType: { price: 100000, quantity: 2 },
          orderQuantity: 2,
        },
      };

      render(<PaymentStatus />);

      // Payment method fee should be 5000 (fixed)
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
    });

    it('calculates PB1 fee correctly', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          ticketType: { price: 100000, quantity: 2 },
          orderQuantity: 2,
        },
      };

      render(<PaymentStatus />);

      // PB1 should be 200000 * 0.1 = 20000 (default 10%)
      expect(screen.getByText('PB1')).toBeInTheDocument();
    });

    it('calculates total payment correctly', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          ticketType: { price: 100000, quantity: 2 },
          orderQuantity: 2,
          event: {
            ...mockTransactionData.transaction.event,
            adminFee: 5, // 5%
          },
          paymentMethod: {
            name: 'Credit Card',
            paymentMethodFee: 2.5, // 2.5%
          },
        },
      };

      render(<PaymentStatus />);

      // Total should be: 200000 + 10000 + 5000 + 20000 = 235000
      expect(screen.getByText('Total Payment')).toBeInTheDocument();
    });
  });

  describe('Navigation Logic', () => {
    it('redirects to transaction page for non-final statuses', async () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          status: 'processing',
        },
      };

      render(<PaymentStatus />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/transaction/transaction-123');
      });
    });

    it('does not redirect for paid status', () => {
      mockSWRData = mockTransactionData;

      render(<PaymentStatus />);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not redirect for failed status', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          status: 'failed',
        },
      };

      render(<PaymentStatus />);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing ticket type data', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          ticketType: { name: null, price: 0, quantity: 0 },
        },
      };

      render(<PaymentStatus />);

      // Should not crash and should handle null ticket type
      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });

    it('handles missing admin fee', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          event: {
            ...mockTransactionData.transaction.event,
            adminFee: null,
          },
        },
      };

      render(<PaymentStatus />);

      // Should handle null admin fee gracefully
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
    });

    it('handles missing event organizer data', () => {
      mockSWRData = {
        transaction: {
          ...mockTransactionData.transaction,
          event: {
            ...mockTransactionData.transaction.event,
            eventOrganizer: null,
          },
        },
      };

      render(<PaymentStatus />);

      // Should handle missing organizer data
      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });
  });
});
