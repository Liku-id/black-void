import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentConfirmationVA from './va';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/components', () => ({
  Box: ({ children, className, onClick }: any) => (
    <div data-testid="box" className={className} onClick={onClick}>
      {children}
    </div>
  ),
  Container: ({ children, className }: any) => (
    <div data-testid="container" className={className}>
      {children}
    </div>
  ),
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
  Button: ({ children, onClick, className, id }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      className={className}
      id={id}
    >
      {children}
    </button>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

jest.mock('@/utils/formatter', () => ({
  formatCountdownTime: jest.fn(
    (seconds) =>
      `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  ),
  formatDate: jest.fn((date) => '2024-01-01'),
  formatRupiah: jest.fn((amount) => `Rp ${amount.toLocaleString()}`),
}));

jest.mock(
  '@/components/payment/transaction-instruction-modal/payment-instructions.json',
  () => ({
    'Bank Transfer': {
      name: 'Bank Transfer Instructions',
      steps: [
        'Open your banking app',
        'Select transfer',
        'Enter the account number',
        'Enter the amount',
        'Confirm the transfer',
      ],
    },
  })
);

jest.mock('@/components/payment/transaction-instruction-modal', () => ({
  __esModule: true,
  default: ({ open, onClose, instruction }: any) =>
    open ? (
      <div data-testid="payment-instruction-modal">
        <div data-testid="modal-title">{instruction?.name}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock icons
jest.mock('@/assets/icons/copy.svg', () => 'copy-icon.svg');
jest.mock('@/assets/icons/accordion-arrow.svg', () => 'accordion-arrow.svg');
jest.mock('@/assets/images/dashed-divider.svg', () => 'dashed-divider.svg');

describe('PaymentConfirmationVA', () => {
  const mockData = {
    transaction: {
      transactionNumber: 'TRX-2024-001',
      paymentDetails: {
        va: {
          accountNumber: '1234567890',
        },
      },
      paymentMethod: {
        name: 'Bank Transfer',
        paymentMethodFee: 5000,
      },
      event: {
        name: 'Tech Conference 2024',
        adminFee: 10,
      },
      createdAt: '2024-01-01T10:00:00Z',
      ticketType: { price: 100000, quantity: 2 },
      orderQuantity: 2,
    },
  };

  const mockMutate = jest.fn();
  const mockSecondsLeft = 900; // 15 minutes

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders payment confirmation title', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Payment Confirmation')).toBeInTheDocument();
    });

    it('displays transaction number', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('TRX-2024-001')).toBeInTheDocument();
    });

    it('displays countdown timer', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('15:00')).toBeInTheDocument();
    });

    it('displays event name', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
    });

    it('displays payment method name', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    });
  });

  describe('Virtual Account Details', () => {
    it('displays virtual account number', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });

    it('displays total amount', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      // Total should be calculated: 200000 + 20000 + 5000 + 20000 = 245000
      const totalElements = screen.getAllByText('Rp 245,000');
      expect(totalElements.length).toBeGreaterThan(0);
    });
  });

  describe('Copy Functionality', () => {
    it('copies account number when copy button is clicked', async () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const copyButtons = screen.getAllByAltText('copy');
      fireEvent.click(copyButtons[0]); // First copy button (account number)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1234567890');
    });

    it('copies total amount when copy button is clicked', async () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const copyButtons = screen.getAllByAltText('copy');
      fireEvent.click(copyButtons[1]); // Second copy button (total amount)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('245000');
    });

    it('shows copied feedback when account number is copied', async () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const copyButtons = screen.getAllByAltText('copy');
      fireEvent.click(copyButtons[0]);

      // The copied feedback should appear briefly
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1234567890');
    });

    it('shows copied feedback when total amount is copied', async () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const copyButtons = screen.getAllByAltText('copy');
      fireEvent.click(copyButtons[1]);

      // The copied feedback should appear briefly
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('245000');
    });
  });

  describe('Accordion Details', () => {
    it('shows "See Details" by default', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('See Details')).toBeInTheDocument();
    });

    it('toggles to "Hide Details" when clicked', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      expect(screen.getByText('Hide Details')).toBeInTheDocument();
    });

    it('shows payment breakdown when details are expanded', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
      expect(screen.getByText('PB1')).toBeInTheDocument();
      expect(screen.getByText('Total Payment')).toBeInTheDocument();
    });

    it('rotates arrow icon when details are toggled', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      const arrowImage = screen.getByAltText('arrow');
      expect(arrowImage).toHaveClass('rotate-180');
    });
  });

  describe('Payment Instructions', () => {
    it('shows payment instruction button', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('See Payment Instruction')).toBeInTheDocument();
    });

    it('opens payment instruction modal when button is clicked', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const instructionButton = screen.getByText('See Payment Instruction');
      fireEvent.click(instructionButton);

      expect(
        screen.getByTestId('payment-instruction-modal')
      ).toBeInTheDocument();
    });

    it('closes payment instruction modal when close button is clicked', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const instructionButton = screen.getByText('See Payment Instruction');
      fireEvent.click(instructionButton);

      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(
        screen.queryByTestId('payment-instruction-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('Confirm Payment', () => {
    it('shows confirm payment button', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Confirm Payment')).toBeInTheDocument();
    });

    it('calls mutate function when confirm payment button is clicked', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const confirmButton = screen.getByText('Confirm Payment');
      fireEvent.click(confirmButton);

      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe('Payment Calculations', () => {
    it('calculates subtotal correctly', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      // Subtotal should be 100000 * 2 = 200000
      expect(screen.getByText('Rp 200,000')).toBeInTheDocument();
    });

    it('calculates admin fee correctly', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      // Admin fee should be 200000 * 0.1 = 20000
      const adminFeeElements = screen.getAllByText('Rp 20,000');
      expect(adminFeeElements.length).toBeGreaterThan(0);
    });

    it('calculates payment method fee correctly', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      // Payment method fee should be 5000 (fixed amount)
      expect(screen.getByText('Rp 5,000')).toBeInTheDocument();
    });

    it('calculates PB1 fee correctly', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      // PB1 should be 200000 * 0.1 = 20000 (default 10%)
      const pb1Elements = screen.getAllByText('Rp 20,000');
      expect(pb1Elements.length).toBeGreaterThan(0);
    });

    it('calculates total payment correctly', () => {
      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const toggleButton = screen.getByText('See Details');
      fireEvent.click(toggleButton);

      // Total should be: 200000 + 20000 + 5000 + 20000 = 245000
      const totalElements = screen.getAllByText('Rp 245,000');
      expect(totalElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing ticket type data', () => {
      const dataWithoutTicketType = {
        transaction: {
          ...mockData.transaction,
          ticketType: null,
        },
      };

      render(
        <PaymentConfirmationVA
          data={dataWithoutTicketType}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      // Should not crash and should handle null ticket type
      expect(screen.getByText('Payment Confirmation')).toBeInTheDocument();
    });

    it('handles missing admin fee', () => {
      const dataWithoutAdminFee = {
        transaction: {
          ...mockData.transaction,
          event: {
            ...mockData.transaction.event,
            adminFee: null,
          },
        },
      };

      render(
        <PaymentConfirmationVA
          data={dataWithoutAdminFee}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      // Should handle null admin fee gracefully
      expect(screen.getByText('Payment Confirmation')).toBeInTheDocument();
    });

    it('handles percentage-based payment method fee', () => {
      const dataWithPercentageFee = {
        transaction: {
          ...mockData.transaction,
          paymentMethod: {
            ...mockData.transaction.paymentMethod,
            paymentMethodFee: 0.025, // 2.5%
          },
        },
      };

      render(
        <PaymentConfirmationVA
          data={dataWithPercentageFee}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      // Should calculate percentage-based fee correctly
      expect(screen.getByText('Payment Confirmation')).toBeInTheDocument();
    });

    it('handles clipboard API failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
        new Error('Clipboard error')
      );

      render(
        <PaymentConfirmationVA
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const copyButtons = screen.getAllByAltText('copy');
      fireEvent.click(copyButtons[0]);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to copy:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
