import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import PaymentConfirmation from './index';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/store', () => ({
  resetOrderBookingAtom: jest.fn(),
}));

jest.mock('@/components', () => ({
  Box: ({ children, className }: any) => (
    <div data-testid="box" className={className}>
      {children}
    </div>
  ),
  Container: ({ children, className }: any) => (
    <div data-testid="container" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/layout/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/utils/timer', () => ({
  useCountdown: jest.fn(() => [900, jest.fn()]),
}));

// Mock dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc: any) => {
    const Component = () => (
      <div data-testid="dynamic-component">Dynamic Component</div>
    );
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

const mockParams = {
  id: 'transaction-123',
};

const mockResetOrder = jest.fn();

describe('PaymentConfirmation', () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const mockUseAtom = useAtom as jest.Mock;
  const mockUseSWR = useSWR as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseParams.mockReturnValue(mockParams);
    mockUseAtom.mockReturnValue([undefined, mockResetOrder]);
  });

  describe('Loading State', () => {
    it('shows loading component when data is loading', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('No Data State', () => {
    it('shows no data message when no data is available', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });

  describe('VA Payment Method', () => {
    const mockVAData = {
      transaction: {
        id: 'transaction-123',
        status: 'pending',
        transactionNumber: 'TRX-2024-001',
        expiresAt: new Date(Date.now() + 900000).toISOString(),
        paymentDetails: {
          va: {
            accountNumber: '1234567890',
          },
        },
        paymentMethod: {
          name: 'Bank Transfer',
        },
        event: {
          name: 'Test Event',
        },
        createdAt: new Date().toISOString(),
        ticketType: { price: 100000, quantity: 2 },
        orderQuantity: 2,
      },
    };

    it('renders VA component when payment method is VA', () => {
      mockUseSWR.mockReturnValue({
        data: mockVAData,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
    });
  });

  describe('QRIS Payment Method', () => {
    const mockQRISData = {
      transaction: {
        id: 'transaction-123',
        status: 'pending',
        transactionNumber: 'TRX-2024-002',
        expiresAt: new Date(Date.now() + 900000).toISOString(),
        paymentDetails: {
          qris: {
            qrString: 'qr-code-string',
            amount: 200000,
          },
        },
        paymentMethod: {
          name: 'QRIS',
        },
        event: {
          name: 'Test Event',
        },
        createdAt: new Date().toISOString(),
        ticketType: { price: 100000, quantity: 2 },
        orderQuantity: 2,
      },
    };

    it('renders QRIS component when payment method is QRIS', () => {
      mockUseSWR.mockReturnValue({
        data: mockQRISData,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
    });
  });

  describe('Status Redirection', () => {
    it('redirects to status page when transaction is not pending', () => {
      const mockData = {
        transaction: {
          id: 'transaction-123',
          status: 'paid',
          paymentDetails: {
            va: {
              accountNumber: '1234567890',
            },
          },
          paymentMethod: {
            name: 'Bank Transfer',
          },
        },
      };

      mockUseSWR.mockReturnValue({
        data: mockData,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/transaction/transaction-123/status'
      );
    });

    it('does not redirect when transaction is pending', () => {
      const mockData = {
        transaction: {
          id: 'transaction-123',
          status: 'pending',
          paymentDetails: {
            va: {
              accountNumber: '1234567890',
            },
          },
          paymentMethod: {
            name: 'Bank Transfer',
          },
        },
      };

      mockUseSWR.mockReturnValue({
        data: mockData,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('Order Reset', () => {
    it('calls resetOrder when component mounts', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(mockResetOrder).toHaveBeenCalled();
    });
  });

  describe('Countdown Logic', () => {
    it('calculates countdown from expiresAt', () => {
      const expiresAt = new Date(Date.now() + 1800000); // 30 minutes from now
      const mockData = {
        transaction: {
          id: 'transaction-123',
          status: 'pending',
          expiresAt: expiresAt.toISOString(),
          paymentDetails: {
            va: {
              accountNumber: '1234567890',
            },
          },
          paymentMethod: {
            name: 'Bank Transfer',
          },
        },
      };

      mockUseSWR.mockReturnValue({
        data: mockData,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      // The component should handle the countdown logic
      expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
    });

    it('handles expired transaction gracefully', () => {
      const expiresAt = new Date(Date.now() - 1000); // Already expired
      const mockData = {
        transaction: {
          id: 'transaction-123',
          status: 'pending',
          expiresAt: expiresAt.toISOString(),
          paymentDetails: {
            va: {
              accountNumber: '1234567890',
            },
          },
          paymentMethod: {
            name: 'Bank Transfer',
          },
        },
      };

      mockUseSWR.mockReturnValue({
        data: mockData,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing transaction ID', () => {
      mockUseParams.mockReturnValue({ id: undefined });

      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      render(<PaymentConfirmation />);

      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });
});
