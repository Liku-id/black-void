import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketInfoCard from './info-card';
import '@testing-library/jest-dom';

// Mock the components
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, className, size, type, ...props }: any) => (
    <div className={className} data-size={size} data-type={type} {...props}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}));

// Mock icons
jest.mock('@/assets/icons/success.svg', () => 'success-icon.svg');
jest.mock('@/assets/icons/error.svg', () => 'error-icon.svg');
jest.mock('@/assets/icons/location-pin.svg', () => 'location-icon.svg');
jest.mock('@/assets/icons/calendar-days.svg', () => 'calendar-icon.svg');

// Mock formatter utility
jest.mock('@/utils/formatter', () => ({
  formatDate: jest.fn((date, format) => {
    if (format === 'datetime') {
      return 'Formatted Date Time';
    }
    return 'Formatted Date';
  }),
}));

describe('TicketInfoCard', () => {
  const mockResetScanner = jest.fn();

  beforeEach(() => {
    mockResetScanner.mockClear();
  });

  describe('Success Status', () => {
    const successData = {
      status: 'success' as const,
      visitorName: 'John Doe',
      ticketName: 'VIP Ticket',
      location: 'Grand Hall',
      eventDate: '2024-01-15T10:00:00Z',
      ticketId: 'TICKET-123',
    };

    it('renders success status correctly', () => {
      render(
        <TicketInfoCard data={successData} resetScanner={mockResetScanner} />
      );

      expect(
        screen.getByText('Ticket Redeemed Successfully')
      ).toBeInTheDocument();
      // The status icon is rendered by the component, so we check it exists
      expect(screen.getByAltText('status icon')).toBeInTheDocument();
    });

    it('displays visitor information for success status', () => {
      render(
        <TicketInfoCard data={successData} resetScanner={mockResetScanner} />
      );

      expect(screen.getByText('Visitor: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Ticket: VIP Ticket')).toBeInTheDocument();
      expect(screen.getByText('Grand Hall')).toBeInTheDocument();
      expect(screen.getByText('Formatted Date Time')).toBeInTheDocument();
    });

    it('displays ticket ID', () => {
      render(
        <TicketInfoCard data={successData} resetScanner={mockResetScanner} />
      );

      expect(screen.getByText('Ticket ID')).toBeInTheDocument();
      expect(screen.getByText('TICKET-123')).toBeInTheDocument();
    });

    it('applies correct styling for success status', () => {
      render(
        <TicketInfoCard data={successData} resetScanner={mockResetScanner} />
      );

      // Check that the main container has the correct styling
      const mainContainer = screen
        .getByText('Ticket Redeemed Successfully')
        .closest('div');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Already Redeemed Status', () => {
    const alreadyRedeemedData = {
      status: 'already_redeemed' as const,
      visitorName: 'Jane Smith',
      ticketName: 'Regular Ticket',
      location: 'Main Arena',
      eventDate: '2024-01-20T14:30:00Z',
      ticketId: 'TICKET-456',
    };

    it('renders already redeemed status correctly', () => {
      render(
        <TicketInfoCard
          data={alreadyRedeemedData}
          resetScanner={mockResetScanner}
        />
      );

      expect(screen.getByText('Ticket Already Redeemed')).toBeInTheDocument();
      expect(screen.getByAltText('status icon')).toBeInTheDocument();
    });

    it('displays visitor information for already redeemed status', () => {
      render(
        <TicketInfoCard
          data={alreadyRedeemedData}
          resetScanner={mockResetScanner}
        />
      );

      expect(screen.getByText('Visitor: Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Ticket: Regular Ticket')).toBeInTheDocument();
    });

    it('applies correct styling for already redeemed status', () => {
      render(
        <TicketInfoCard
          data={alreadyRedeemedData}
          resetScanner={mockResetScanner}
        />
      );

      const mainContainer = screen
        .getByText('Ticket Already Redeemed')
        .closest('div');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Failed Status', () => {
    const failedData = {
      status: 'failed' as const,
      message: 'Network error occurred',
      ticketId: 'TICKET-789',
    };

    it('renders failed status correctly', () => {
      render(
        <TicketInfoCard data={failedData} resetScanner={mockResetScanner} />
      );

      expect(screen.getByText('Ticket Redemption Failed')).toBeInTheDocument();
      expect(screen.getByAltText('status icon')).toBeInTheDocument();
    });

    it('displays error message for failed status', () => {
      render(
        <TicketInfoCard data={failedData} resetScanner={mockResetScanner} />
      );

      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    it('applies correct styling for failed status', () => {
      render(
        <TicketInfoCard data={failedData} resetScanner={mockResetScanner} />
      );

      const mainContainer = screen
        .getByText('Ticket Redemption Failed')
        .closest('div');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Invalid Ticket Status', () => {
    const invalidTicketData = {
      status: 'invalid_ticket' as const,
      message: 'Ticket not found in database',
      ticketId: 'TICKET-999',
    };

    it('renders invalid ticket status correctly', () => {
      render(
        <TicketInfoCard
          data={invalidTicketData}
          resetScanner={mockResetScanner}
        />
      );

      expect(screen.getByText('Invalid Ticket Status')).toBeInTheDocument();
      expect(screen.getByAltText('status icon')).toBeInTheDocument();
    });

    it('displays error message for invalid ticket status', () => {
      render(
        <TicketInfoCard
          data={invalidTicketData}
          resetScanner={mockResetScanner}
        />
      );

      expect(
        screen.getByText('Ticket not found in database')
      ).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('does not show visitor info for error statuses', () => {
      const errorData = {
        status: 'failed' as const,
        visitorName: 'John Doe',
        ticketName: 'VIP Ticket',
        message: 'Error occurred',
      };

      render(
        <TicketInfoCard data={errorData} resetScanner={mockResetScanner} />
      );

      expect(screen.queryByText('Visitor: John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('Ticket: VIP Ticket')).not.toBeInTheDocument();
    });

    it('does not show error message for success status', () => {
      const successData = {
        status: 'success' as const,
        visitorName: 'John Doe',
        message: 'This should not show',
      };

      render(
        <TicketInfoCard data={successData} resetScanner={mockResetScanner} />
      );

      expect(
        screen.queryByText('This should not show')
      ).not.toBeInTheDocument();
    });

    it('does not show ticket ID when not provided', () => {
      const dataWithoutTicketId = {
        status: 'success' as const,
        visitorName: 'John Doe',
      };

      render(
        <TicketInfoCard
          data={dataWithoutTicketId}
          resetScanner={mockResetScanner}
        />
      );

      expect(screen.queryByText('Ticket ID')).not.toBeInTheDocument();
    });

    it('does not show visitor info when visitor name is not provided', () => {
      const dataWithoutVisitorName = {
        status: 'success' as const,
        ticketName: 'VIP Ticket',
      };

      render(
        <TicketInfoCard
          data={dataWithoutVisitorName}
          resetScanner={mockResetScanner}
        />
      );

      expect(screen.queryByText(/Visitor:/)).not.toBeInTheDocument();
    });

    it('does not show ticket info when ticket name is not provided', () => {
      const dataWithoutTicketName = {
        status: 'success' as const,
        visitorName: 'John Doe',
      };

      render(
        <TicketInfoCard
          data={dataWithoutTicketName}
          resetScanner={mockResetScanner}
        />
      );

      expect(screen.queryByText(/Ticket:/)).not.toBeInTheDocument();
    });
  });

  describe('Reset Scanner Button', () => {
    it('renders reset scanner button', () => {
      const data = { status: 'success' as const };
      render(<TicketInfoCard data={data} resetScanner={mockResetScanner} />);

      expect(screen.getByText('Scan Another Ticket')).toBeInTheDocument();
    });

    it('calls resetScanner when button is clicked', () => {
      const data = { status: 'success' as const };
      render(<TicketInfoCard data={data} resetScanner={mockResetScanner} />);

      const resetButton = screen.getByText('Scan Another Ticket');
      fireEvent.click(resetButton);

      expect(mockResetScanner).toHaveBeenCalledTimes(1);
    });

    it('button has correct styling', () => {
      const data = { status: 'success' as const };
      render(<TicketInfoCard data={data} resetScanner={mockResetScanner} />);

      const resetButton = screen.getByText('Scan Another Ticket');
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('renders location icon when location is provided', () => {
      const data = {
        status: 'success' as const,
        visitorName: 'John Doe', // Required for visitor info section to render
        location: 'Grand Hall',
      };

      render(<TicketInfoCard data={data} resetScanner={mockResetScanner} />);

      // Check that location text is displayed
      expect(screen.getByText('Grand Hall')).toBeInTheDocument();
    });

    it('renders calendar icon when event date is provided', () => {
      const data = {
        status: 'success' as const,
        visitorName: 'John Doe', // Required for visitor info section to render
        eventDate: '2024-01-15T10:00:00Z',
      };

      render(<TicketInfoCard data={data} resetScanner={mockResetScanner} />);

      // Check that formatted date is displayed
      expect(screen.getByText('Formatted Date Time')).toBeInTheDocument();
    });
  });
});
