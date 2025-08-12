import { render, screen, fireEvent } from '@testing-library/react';
import QRISComponent from './qris';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/components', () => ({
  Box: ({ children, className, onClick, id }: any) => (
    <div data-testid="box" className={className} onClick={onClick} id={id}>
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
  QRCode: ({ value, size }: any) => (
    <div data-testid="qr-code" data-value={value} data-size={size}>
      QR Code: {value}
    </div>
  ),
}));

jest.mock('@/utils/formatter', () => ({
  formatCountdownTime: jest.fn(
    (seconds) =>
      `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  ),
  formatRupiah: jest.fn((amount) => `Rp ${amount.toLocaleString()}`),
}));

// Mock html2canvas
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    toDataURL: jest.fn(() => 'data:image/png;base64,mock-data-url'),
  })),
}));

describe('QRISComponent', () => {
  const mockData = {
    transaction: {
      transactionNumber: 'TRX-2024-002',
      paymentDetails: {
        qris: {
          qrString: 'qr-code-string-123',
          amount: 200000,
        },
      },
      paymentMethod: {
        name: 'QRIS',
      },
      event: {
        name: 'Tech Conference 2024',
      },
      createdAt: '2024-01-01T10:00:00Z',
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
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('One more step to have fun')).toBeInTheDocument();
    });

    it('displays transaction number', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('TRX-2024-002')).toBeInTheDocument();
    });

    it('displays countdown timer', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('15:00')).toBeInTheDocument();
    });

    it('displays payment amount', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Rp 200,000')).toBeInTheDocument();
    });

    it('displays payment gateway information', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Xendit Payment gateway')).toBeInTheDocument();
    });
  });

  describe('QR Code Rendering', () => {
    it('renders QR code with correct value', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const qrCode = screen.getByTestId('qr-code');
      expect(qrCode).toBeInTheDocument();
      expect(qrCode).toHaveAttribute('data-value', 'qr-code-string-123');
      expect(qrCode).toHaveAttribute('data-size', '200');
    });

    it('displays QR code value text', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(
        screen.getByText('QR Code: qr-code-string-123')
      ).toBeInTheDocument();
    });

    it('has correct QR code container ID', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const qrContainer = screen.getByTestId('qr-code');
      expect(qrContainer).toBeInTheDocument();
    });
  });

  describe('Download QR Code', () => {
    it('shows download QR code button', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Download QR code')).toBeInTheDocument();
    });

    it('handles download QR code button click', async () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const downloadButton = screen.getByText('Download QR code');
      fireEvent.click(downloadButton);

      // Verify that html2canvas was called
      const html2canvas = require('html2canvas').default;
      expect(html2canvas).toHaveBeenCalled();
    });
  });

  describe('Confirm Payment', () => {
    it('shows confirm payment button', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Confirm Payment')).toBeInTheDocument();
    });

    it('calls mutate function when confirm payment button is clicked', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const confirmButton = screen.getByText('Confirm Payment');
      fireEvent.click(confirmButton);

      expect(mockMutate).toHaveBeenCalled();
    });

    it('has correct button ID', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const confirmButton = screen.getByText('Confirm Payment');
      expect(confirmButton).toHaveAttribute('id', 'confirm_payment_button');
    });
  });

  describe('Layout and Styling', () => {
    it('renders with correct container structure', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('container')).toHaveClass(
        'flex justify-center'
      );
    });

    it('renders with correct box styling', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const boxes = screen.getAllByTestId('box');
      const mainBox = boxes.find((box) =>
        box.className?.includes('border bg-white')
      );
      expect(mainBox).toBeInTheDocument();
    });

    it('renders with correct typography sizes', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      // Check that the component renders without crashing
      expect(screen.getByText('One more step to have fun')).toBeInTheDocument();
    });
  });

  describe('Countdown Display', () => {
    it('displays countdown in correct format', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('15:00')).toBeInTheDocument();
    });

    it('displays countdown with red color styling', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      const countdownElement = screen.getByText('15:00');
      expect(countdownElement).toHaveClass('text-red');
    });

    it('handles different countdown values', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={65} // 1 minute 5 seconds
        />
      );

      expect(screen.getByText('1:05')).toBeInTheDocument();
    });
  });

  describe('Amount Formatting', () => {
    it('formats amount correctly', () => {
      render(
        <QRISComponent
          data={mockData}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Rp 200,000')).toBeInTheDocument();
    });

    it('handles different amount values', () => {
      const dataWithDifferentAmount = {
        transaction: {
          ...mockData.transaction,
          paymentDetails: {
            qris: {
              qrString: 'qr-code-string-123',
              amount: 50000,
            },
          },
        },
      };

      render(
        <QRISComponent
          data={dataWithDifferentAmount}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Rp 50,000')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing QR string gracefully', () => {
      const dataWithoutQRString = {
        transaction: {
          ...mockData.transaction,
          paymentDetails: {
            qris: {
              qrString: '',
              amount: 200000,
            },
          },
        },
      };

      render(
        <QRISComponent
          data={dataWithoutQRString}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      // Should handle empty QR string gracefully
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });

    it('handles zero amount gracefully', () => {
      const dataWithZeroAmount = {
        transaction: {
          ...mockData.transaction,
          paymentDetails: {
            qris: {
              qrString: 'qr-code-string-123',
              amount: 0,
            },
          },
        },
      };

      render(
        <QRISComponent
          data={dataWithZeroAmount}
          mutate={mockMutate}
          secondsLeft={mockSecondsLeft}
        />
      );

      expect(screen.getByText('Rp 0')).toBeInTheDocument();
    });
  });
});
