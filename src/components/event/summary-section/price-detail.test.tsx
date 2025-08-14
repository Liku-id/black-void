import React from 'react';
import { render, screen } from '@testing-library/react';
import PriceDetail from './price-detail';

// Mock dependencies
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, type, size, color, className }: any) => (
    <span className={`${type}-${size} ${color} ${className}`}>{children}</span>
  ),
}));

jest.mock('@/utils/formatter', () => ({
  formatRupiah: jest.fn((amount) => `Rp ${amount.toLocaleString()}`),
}));

describe('PriceDetail Component', () => {
  const defaultProps = {
    totalPrice: 250000,
    paymentMethodFee: 1250,
    adminFee: 12500,
    tax: 25000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render price detail section with correct title', () => {
      render(<PriceDetail {...defaultProps} />);

      expect(screen.getByText('Price Detail')).toBeInTheDocument();
    });

    it('should render all price components', () => {
      render(<PriceDetail {...defaultProps} />);

      expect(screen.getByText('Ticket Price')).toBeInTheDocument();
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
      expect(screen.getByText('PB1')).toBeInTheDocument();
    });

    it('should display formatted prices correctly', () => {
      render(<PriceDetail {...defaultProps} />);

      expect(screen.getByText('Rp 250,000')).toBeInTheDocument(); // Total Price
      expect(screen.getByText('Rp 1,250')).toBeInTheDocument(); // Payment Method Fee
      expect(screen.getByText('Rp 12,500')).toBeInTheDocument(); // Admin Fee
      expect(screen.getByText('Rp 25,000')).toBeInTheDocument(); // Tax
    });

    it('should have proper styling for title', () => {
      render(<PriceDetail {...defaultProps} />);

      const title = screen.getByText('Price Detail');
      expect(title).toHaveClass('heading-16');
    });

    it('should have proper styling for price rows', () => {
      render(<PriceDetail {...defaultProps} />);

      const priceRows = screen.getAllByText(/Rp \d+,?\d*/);
      priceRows.forEach((row) => {
        expect(row).toHaveClass('body-12', 'text-muted', 'font-bold');
      });
    });

    it('should have proper styling for labels', () => {
      render(<PriceDetail {...defaultProps} />);

      const labels = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      labels.forEach((label) => {
        expect(label).toHaveClass('body-12', 'text-muted', 'font-light');
      });
    });
  });

  describe('Price Calculations and Display', () => {
    it('should handle zero values correctly', () => {
      const zeroProps = {
        totalPrice: 0,
        paymentMethodFee: 0,
        adminFee: 0,
        tax: 0,
      };

      render(<PriceDetail {...zeroProps} />);

      expect(screen.getByText('Rp 0')).toBeInTheDocument();
      expect(screen.getAllByText('Rp 0')).toHaveLength(4);
    });

    it('should handle large numbers correctly', () => {
      const largeProps = {
        totalPrice: 1000000,
        paymentMethodFee: 5000,
        adminFee: 50000,
        tax: 100000,
      };

      render(<PriceDetail {...largeProps} />);

      expect(screen.getByText('Rp 1,000,000')).toBeInTheDocument();
      expect(screen.getByText('Rp 5,000')).toBeInTheDocument();
      expect(screen.getByText('Rp 50,000')).toBeInTheDocument();
      expect(screen.getByText('Rp 100,000')).toBeInTheDocument();
    });

    it('should handle decimal values correctly', () => {
      const decimalProps = {
        totalPrice: 100.5,
        paymentMethodFee: 2.25,
        adminFee: 5.025,
        tax: 10.05,
      };

      render(<PriceDetail {...decimalProps} />);

      expect(screen.getByText('Rp 100.5')).toBeInTheDocument();
      expect(screen.getByText('Rp 2.25')).toBeInTheDocument();
      expect(screen.getByText('Rp 5.025')).toBeInTheDocument();
      expect(screen.getByText('Rp 10.05')).toBeInTheDocument();
    });

    it('should handle negative values correctly', () => {
      const negativeProps = {
        totalPrice: -1000,
        paymentMethodFee: -50,
        adminFee: -100,
        tax: -200,
      };

      render(<PriceDetail {...negativeProps} />);

      expect(screen.getByText('Rp -1,000')).toBeInTheDocument();
      expect(screen.getByText('Rp -50')).toBeInTheDocument();
      expect(screen.getByText('Rp -100')).toBeInTheDocument();
      expect(screen.getByText('Rp -200')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('should have proper flex layout for price rows', () => {
      render(<PriceDetail {...defaultProps} />);

      const priceRows = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      priceRows.forEach((row) => {
        const container = row.closest('div');
        expect(container).toHaveClass('flex', 'justify-between');
      });
    });

    it('should have proper spacing between rows', () => {
      render(<PriceDetail {...defaultProps} />);

      const priceRows = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );

      // First three rows should have margin bottom
      for (let i = 0; i < 3; i++) {
        const container = priceRows[i].closest('div');
        expect(container).toHaveClass('lg:mb-1');
      }

      // Last row (PB1) should not have margin bottom
      const lastRow = priceRows[3].closest('div');
      expect(lastRow).not.toHaveClass('lg:mb-1');
    });

    it('should have proper container styling', () => {
      render(<PriceDetail {...defaultProps} />);

      const container = screen.getByText('Price Detail').closest('div');
      expect(container).toHaveClass('g:mt-3', 'lg:mb-1');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className when provided', () => {
      const customClassName = 'custom-price-detail';
      render(<PriceDetail {...defaultProps} className={customClassName} />);

      const container = screen.getByText('Price Detail').closest('div');
      expect(container).toHaveClass(customClassName);
    });

    it('should work without custom className', () => {
      render(<PriceDetail {...defaultProps} />);

      const container = screen.getByText('Price Detail').closest('div');
      expect(container).toHaveClass('');
    });

    it('should handle empty string className', () => {
      render(<PriceDetail {...defaultProps} className="" />);

      const container = screen.getByText('Price Detail').closest('div');
      expect(container).toHaveClass('');
    });

    it('should handle multiple custom classNames', () => {
      const customClassName = 'custom-price-detail additional-class';
      render(<PriceDetail {...defaultProps} className={customClassName} />);

      const container = screen.getByText('Price Detail').closest('div');
      expect(container).toHaveClass('custom-price-detail', 'additional-class');
    });
  });

  describe('Typography and Styling', () => {
    it('should have correct typography types for title', () => {
      render(<PriceDetail {...defaultProps} />);

      const title = screen.getByText('Price Detail');
      expect(title).toHaveClass('heading-16');
    });

    it('should have correct typography types for labels', () => {
      render(<PriceDetail {...defaultProps} />);

      const labels = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      labels.forEach((label) => {
        expect(label).toHaveClass('body-12');
      });
    });

    it('should have correct typography types for values', () => {
      render(<PriceDetail {...defaultProps} />);

      const values = screen.getAllByText(/Rp \d+,?\d*/);
      values.forEach((value) => {
        expect(value).toHaveClass('body-12');
      });
    });

    it('should have correct color classes', () => {
      render(<PriceDetail {...defaultProps} />);

      const labels = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      labels.forEach((label) => {
        expect(label).toHaveClass('text-muted');
      });

      const values = screen.getAllByText(/Rp \d+,?\d*/);
      values.forEach((value) => {
        expect(value).toHaveClass('text-muted');
      });
    });

    it('should have correct font weight classes', () => {
      render(<PriceDetail {...defaultProps} />);

      const labels = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      labels.forEach((label) => {
        expect(label).toHaveClass('font-light');
      });

      const values = screen.getAllByText(/Rp \d+,?\d*/);
      values.forEach((value) => {
        expect(value).toHaveClass('font-bold');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive margin classes', () => {
      render(<PriceDetail {...defaultProps} />);

      const container = screen.getByText('Price Detail').closest('div');
      expect(container).toHaveClass('g:mt-3', 'lg:mb-1');

      const priceRows = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee/
      );
      priceRows.forEach((row) => {
        const rowContainer = row.closest('div');
        expect(rowContainer).toHaveClass('lg:mb-1');
      });
    });

    it('should maintain layout on different screen sizes', () => {
      render(<PriceDetail {...defaultProps} />);

      const priceRows = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      priceRows.forEach((row) => {
        const container = row.closest('div');
        expect(container).toHaveClass('flex', 'justify-between');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values gracefully', () => {
      const undefinedProps = {
        totalPrice: undefined as any,
        paymentMethodFee: undefined as any,
        adminFee: undefined as any,
        tax: undefined as any,
      };

      render(<PriceDetail {...undefinedProps} />);

      // Should still render the component structure
      expect(screen.getByText('Price Detail')).toBeInTheDocument();
      expect(screen.getByText('Ticket Price')).toBeInTheDocument();
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
      expect(screen.getByText('PB1')).toBeInTheDocument();
    });

    it('should handle null values gracefully', () => {
      const nullProps = {
        totalPrice: null as any,
        paymentMethodFee: null as any,
        adminFee: null as any,
        tax: null as any,
      };

      render(<PriceDetail {...nullProps} />);

      // Should still render the component structure
      expect(screen.getByText('Price Detail')).toBeInTheDocument();
    });

    it('should handle string values correctly', () => {
      const stringProps = {
        totalPrice: '100000' as any,
        paymentMethodFee: '500' as any,
        adminFee: '5000' as any,
        tax: '10000' as any,
      };

      render(<PriceDetail {...stringProps} />);

      // Should format string numbers correctly
      expect(screen.getByText('Rp 100,000')).toBeInTheDocument();
      expect(screen.getByText('Rp 500')).toBeInTheDocument();
      expect(screen.getByText('Rp 5,000')).toBeInTheDocument();
      expect(screen.getByText('Rp 10,000')).toBeInTheDocument();
    });

    it('should handle very large numbers', () => {
      const largeProps = {
        totalPrice: 999999999,
        paymentMethodFee: 999999,
        adminFee: 9999999,
        tax: 99999999,
      };

      render(<PriceDetail {...largeProps} />);

      expect(screen.getByText('Rp 999,999,999')).toBeInTheDocument();
      expect(screen.getByText('Rp 999,999')).toBeInTheDocument();
      expect(screen.getByText('Rp 9,999,999')).toBeInTheDocument();
      expect(screen.getByText('Rp 99,999,999')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      render(<PriceDetail {...defaultProps} />);

      // Should have proper heading structure
      expect(screen.getByText('Price Detail')).toBeInTheDocument();
    });

    it('should have proper text content for screen readers', () => {
      render(<PriceDetail {...defaultProps} />);

      // All text should be accessible
      expect(screen.getByText('Ticket Price')).toBeInTheDocument();
      expect(screen.getByText('Payment Method Fee')).toBeInTheDocument();
      expect(screen.getByText('Admin Fee')).toBeInTheDocument();
      expect(screen.getByText('PB1')).toBeInTheDocument();
    });

    it('should have proper contrast with muted text color', () => {
      render(<PriceDetail {...defaultProps} />);

      const labels = screen.getAllByText(
        /Ticket Price|Payment Method Fee|Admin Fee|PB1/
      );
      labels.forEach((label) => {
        expect(label).toHaveClass('text-muted');
      });
    });
  });

  describe('Integration with formatRupiah', () => {
    it('should call formatRupiah for all price values', () => {
      const { formatRupiah } = require('@/utils/formatter');

      render(<PriceDetail {...defaultProps} />);

      expect(formatRupiah).toHaveBeenCalledWith(250000); // totalPrice
      expect(formatRupiah).toHaveBeenCalledWith(1250); // paymentMethodFee
      expect(formatRupiah).toHaveBeenCalledWith(12500); // adminFee
      expect(formatRupiah).toHaveBeenCalledWith(25000); // tax
      expect(formatRupiah).toHaveBeenCalledTimes(4);
    });

    it('should handle formatRupiah errors gracefully', () => {
      const { formatRupiah } = require('@/utils/formatter');
      formatRupiah.mockImplementation(() => {
        throw new Error('Format error');
      });

      // Should not crash the component
      expect(() => render(<PriceDetail {...defaultProps} />)).not.toThrow();
    });
  });
});
