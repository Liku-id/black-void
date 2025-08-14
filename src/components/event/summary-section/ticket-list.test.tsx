import React from 'react';
import { render, screen } from '@testing-library/react';
import TicketList from './ticket-list';
import type { TicketSummary } from '../types';

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

describe('TicketList Component', () => {
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
    {
      id: '3',
      name: 'Early Bird Ticket',
      price: '75000',
      count: 3,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render all tickets in the list', () => {
      render(<TicketList tickets={mockTickets} />);

      expect(screen.getByText('VIP Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Ticket')).toBeInTheDocument();
      expect(screen.getByText('Early Bird Ticket')).toBeInTheDocument();
    });

    it('should display ticket counts correctly', () => {
      render(<TicketList tickets={mockTickets} />);

      expect(screen.getByText('Total: 2 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Total: 1 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Total: 3 Tickets')).toBeInTheDocument();
    });

    it('should display formatted subtotals correctly', () => {
      render(<TicketList tickets={mockTickets} />);

      expect(screen.getByText('Rp 200,000')).toBeInTheDocument(); // 2 * 100000
      expect(screen.getByText('Rp 50,000')).toBeInTheDocument(); // 1 * 50000
      expect(screen.getByText('Rp 225,000')).toBeInTheDocument(); // 3 * 75000
    });

    it('should have proper container styling', () => {
      render(<TicketList tickets={mockTickets} />);

      const container = screen
        .getByText('VIP Ticket')
        .closest('div')?.parentElement;
      expect(container).toHaveClass('mb-3', 'lg:mb-4');
    });
  });

  describe('Ticket Item Styling', () => {
    it('should have proper border styling for each ticket', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketItems = screen.getAllByText(
        /VIP Ticket|Regular Ticket|Early Bird Ticket/
      );
      ticketItems.forEach((item) => {
        const container = item.closest('div');
        expect(container).toHaveClass('border-l-2', 'border-black', 'pl-2');
      });
    });

    it('should have proper spacing between tickets', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketItems = screen.getAllByText(
        /VIP Ticket|Regular Ticket|Early Bird Ticket/
      );

      // First ticket should not have top margin
      const firstTicket = ticketItems[0].closest('div');
      expect(firstTicket).not.toHaveClass('mt-4');

      // Subsequent tickets should have top margin
      for (let i = 1; i < ticketItems.length; i++) {
        const ticket = ticketItems[i].closest('div');
        expect(ticket).toHaveClass('mt-4');
      }
    });

    it('should have proper typography for ticket names', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketNames = screen.getAllByText(
        /VIP Ticket|Regular Ticket|Early Bird Ticket/
      );
      ticketNames.forEach((name) => {
        expect(name).toHaveClass('heading-22');
      });
    });

    it('should have proper typography for ticket details', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketCounts = screen.getAllByText(/Total: \d+ Tickets/);
      ticketCounts.forEach((count) => {
        expect(count).toHaveClass('body-12', 'text-muted', 'font-light');
      });

      const subtotals = screen.getAllByText(/Rp \d+,?\d*/);
      subtotals.forEach((subtotal) => {
        expect(subtotal).toHaveClass('body-12', 'text-black', 'font-light');
      });
    });
  });

  describe('Layout and Structure', () => {
    it('should have proper flex layout for ticket details', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketDetails = screen.getAllByText(/Total: \d+ Tickets/);
      ticketDetails.forEach((detail) => {
        const container = detail.closest('div');
        expect(container).toHaveClass(
          'flex',
          'items-center',
          'justify-between'
        );
      });
    });

    it('should have proper spacing for ticket details', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketDetails = screen.getAllByText(/Total: \d+ Tickets/);
      ticketDetails.forEach((detail) => {
        const container = detail.closest('div');
        expect(container).toHaveClass('mt-1', 'lg:mt-2');
      });
    });

    it('should have proper leading for ticket names', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketNames = screen.getAllByText(
        /VIP Ticket|Regular Ticket|Early Bird Ticket/
      );
      ticketNames.forEach((name) => {
        expect(name).toHaveClass('leading-none');
      });
    });
  });

  describe('Price Calculations', () => {
    it('should calculate subtotals correctly', () => {
      render(<TicketList tickets={mockTickets} />);

      // VIP Ticket: 2 * 100000 = 200000
      expect(screen.getByText('Rp 200,000')).toBeInTheDocument();

      // Regular Ticket: 1 * 50000 = 50000
      expect(screen.getByText('Rp 50,000')).toBeInTheDocument();

      // Early Bird Ticket: 3 * 75000 = 225000
      expect(screen.getByText('Rp 225,000')).toBeInTheDocument();
    });

    it('should handle zero count tickets', () => {
      const ticketsWithZero = [
        {
          id: '1',
          name: 'Free Ticket',
          price: '0',
          count: 0,
        },
      ];

      render(<TicketList tickets={ticketsWithZero} />);

      expect(screen.getByText('Total: 0 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 0')).toBeInTheDocument();
    });

    it('should handle single ticket correctly', () => {
      const singleTicket = [
        {
          id: '1',
          name: 'Single Ticket',
          price: '75000',
          count: 1,
        },
      ];

      render(<TicketList tickets={singleTicket} />);

      expect(screen.getByText('Total: 1 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 75,000')).toBeInTheDocument();
    });

    it('should handle decimal prices correctly', () => {
      const decimalTickets = [
        {
          id: '1',
          name: 'Decimal Ticket',
          price: '99.99',
          count: 2,
        },
      ];

      render(<TicketList tickets={decimalTickets} />);

      expect(screen.getByText('Total: 2 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 199.98')).toBeInTheDocument();
    });

    it('should handle large numbers correctly', () => {
      const largeTickets = [
        {
          id: '1',
          name: 'Premium Ticket',
          price: '1000000',
          count: 5,
        },
      ];

      render(<TicketList tickets={largeTickets} />);

      expect(screen.getByText('Total: 5 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 5,000,000')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tickets array', () => {
      render(<TicketList tickets={[]} />);

      // Should render container but no tickets
      const container = screen.getByText('').closest('div')?.parentElement;
      expect(container).toHaveClass('mb-3', 'lg:mb-4');
    });

    it('should handle undefined tickets', () => {
      render(<TicketList tickets={undefined as any} />);

      // Should not crash
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle null tickets', () => {
      render(<TicketList tickets={null as any} />);

      // Should not crash
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle tickets with missing properties', () => {
      const incompleteTickets = [
        {
          id: '1',
          name: undefined,
          price: undefined,
          count: undefined,
        } as any,
      ];

      render(<TicketList tickets={incompleteTickets} />);

      // Should not crash
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle tickets with string numbers', () => {
      const stringTickets = [
        {
          id: '1',
          name: 'String Price Ticket',
          price: '50000',
          count: 2,
        },
      ];

      render(<TicketList tickets={stringTickets} />);

      expect(screen.getByText('Total: 2 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 100,000')).toBeInTheDocument();
    });

    it('should handle tickets with very large numbers', () => {
      const largeTickets = [
        {
          id: '1',
          name: 'Mega Ticket',
          price: '999999999',
          count: 999,
        },
      ];

      render(<TicketList tickets={largeTickets} />);

      expect(screen.getByText('Total: 999 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 998,999,001')).toBeInTheDocument();
    });

    it('should handle tickets with negative values', () => {
      const negativeTickets = [
        {
          id: '1',
          name: 'Negative Ticket',
          price: '-1000',
          count: -2,
        },
      ];

      render(<TicketList tickets={negativeTickets} />);

      expect(screen.getByText('Total: -2 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Rp 2,000')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive margin classes', () => {
      render(<TicketList tickets={mockTickets} />);

      const container = screen
        .getByText('VIP Ticket')
        .closest('div')?.parentElement;
      expect(container).toHaveClass('mb-3', 'lg:mb-4');

      const ticketDetails = screen.getAllByText(/Total: \d+ Tickets/);
      ticketDetails.forEach((detail) => {
        const container = detail.closest('div');
        expect(container).toHaveClass('mt-1', 'lg:mt-2');
      });
    });

    it('should maintain layout on different screen sizes', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketDetails = screen.getAllByText(/Total: \d+ Tickets/);
      ticketDetails.forEach((detail) => {
        const container = detail.closest('div');
        expect(container).toHaveClass(
          'flex',
          'items-center',
          'justify-between'
        );
      });
    });
  });

  describe('Typography and Styling', () => {
    it('should have correct typography types for ticket names', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketNames = screen.getAllByText(
        /VIP Ticket|Regular Ticket|Early Bird Ticket/
      );
      ticketNames.forEach((name) => {
        expect(name).toHaveClass('heading-22');
      });
    });

    it('should have correct typography types for ticket counts', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketCounts = screen.getAllByText(/Total: \d+ Tickets/);
      ticketCounts.forEach((count) => {
        expect(count).toHaveClass('body-12');
      });
    });

    it('should have correct typography types for subtotals', () => {
      render(<TicketList tickets={mockTickets} />);

      const subtotals = screen.getAllByText(/Rp \d+,?\d*/);
      subtotals.forEach((subtotal) => {
        expect(subtotal).toHaveClass('body-12');
      });
    });

    it('should have correct color classes', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketCounts = screen.getAllByText(/Total: \d+ Tickets/);
      ticketCounts.forEach((count) => {
        expect(count).toHaveClass('text-muted');
      });

      const subtotals = screen.getAllByText(/Rp \d+,?\d*/);
      subtotals.forEach((subtotal) => {
        expect(subtotal).toHaveClass('text-black');
      });
    });

    it('should have correct font weight classes', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketCounts = screen.getAllByText(/Total: \d+ Tickets/);
      ticketCounts.forEach((count) => {
        expect(count).toHaveClass('font-light');
      });

      const subtotals = screen.getAllByText(/Rp \d+,?\d*/);
      subtotals.forEach((subtotal) => {
        expect(subtotal).toHaveClass('font-light');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      render(<TicketList tickets={mockTickets} />);

      // Should have proper heading structure for ticket names
      const ticketNames = screen.getAllByText(
        /VIP Ticket|Regular Ticket|Early Bird Ticket/
      );
      ticketNames.forEach((name) => {
        expect(name).toHaveClass('heading-22');
      });
    });

    it('should have proper text content for screen readers', () => {
      render(<TicketList tickets={mockTickets} />);

      // All text should be accessible
      expect(screen.getByText('VIP Ticket')).toBeInTheDocument();
      expect(screen.getByText('Total: 2 Tickets')).toBeInTheDocument();
      expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    });

    it('should have proper contrast with muted text color', () => {
      render(<TicketList tickets={mockTickets} />);

      const ticketCounts = screen.getAllByText(/Total: \d+ Tickets/);
      ticketCounts.forEach((count) => {
        expect(count).toHaveClass('text-muted');
      });
    });
  });

  describe('Integration with formatRupiah', () => {
    it('should call formatRupiah for all subtotals', () => {
      const { formatRupiah } = require('@/utils/formatter');

      render(<TicketList tickets={mockTickets} />);

      expect(formatRupiah).toHaveBeenCalledWith(200000); // VIP: 2 * 100000
      expect(formatRupiah).toHaveBeenCalledWith(50000); // Regular: 1 * 50000
      expect(formatRupiah).toHaveBeenCalledWith(225000); // Early Bird: 3 * 75000
      expect(formatRupiah).toHaveBeenCalledTimes(3);
    });

    it('should handle formatRupiah errors gracefully', () => {
      const { formatRupiah } = require('@/utils/formatter');
      formatRupiah.mockImplementation(() => {
        throw new Error('Format error');
      });

      // Should not crash the component
      expect(() => render(<TicketList tickets={mockTickets} />)).not.toThrow();
    });

    it('should pass correct values to formatRupiah', () => {
      const { formatRupiah } = require('@/utils/formatter');

      const testTickets = [
        {
          id: '1',
          name: 'Test Ticket',
          price: '100',
          count: 5,
        },
      ];

      render(<TicketList tickets={testTickets} />);

      expect(formatRupiah).toHaveBeenCalledWith(500); // 5 * 100
    });
  });

  describe('Data Structure Validation', () => {
    it('should handle tickets with different data types', () => {
      const mixedTickets = [
        {
          id: 1,
          name: 'Number ID Ticket',
          price: 1000,
          count: 2,
        } as any,
        {
          id: 'string-id',
          name: 'String ID Ticket',
          price: '2000',
          count: '3',
        } as any,
      ];

      render(<TicketList tickets={mixedTickets} />);

      expect(screen.getByText('Number ID Ticket')).toBeInTheDocument();
      expect(screen.getByText('String ID Ticket')).toBeInTheDocument();
    });

    it('should handle tickets with extra properties', () => {
      const extraPropsTickets = [
        {
          id: '1',
          name: 'Extra Props Ticket',
          price: '1000',
          count: 1,
          extraProp: 'extra value',
          anotherProp: 123,
        } as any,
      ];

      render(<TicketList tickets={extraPropsTickets} />);

      expect(screen.getByText('Extra Props Ticket')).toBeInTheDocument();
      expect(screen.getByText('Rp 1,000')).toBeInTheDocument();
    });
  });
});
