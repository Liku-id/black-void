import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import Event from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock swr
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock jotai
jest.mock('jotai', () => ({
  useAtom: jest.fn(),
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

// Mock components
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Container: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/event/event-detail-section', () => ({
  __esModule: true,
  default: ({ data, onChooseTicket }: any) => (
    <div data-testid="event-detail-section">
      Event Detail Section
      <button onClick={onChooseTicket}>Choose Ticket</button>
    </div>
  ),
}));

jest.mock('@/components/event/skeletons', () => ({
  __esModule: true,
  default: () => <div data-testid="event-page-skeleton">Loading...</div>,
}));

jest.mock('@/components/event/ticket-list-section', () => ({
  __esModule: true,
  default: ({ data, tickets, handleChangeCount }: any) => (
    <div data-testid="ticket-list-section">
      Ticket List Section
      {tickets.map((ticket: any) => (
        <div key={ticket.id} data-testid={`ticket-${ticket.id}`}>
          {ticket.name} - Count: {ticket.count}
          <button onClick={() => handleChangeCount(ticket.id, 1)}>+</button>
          <button onClick={() => handleChangeCount(ticket.id, -1)}>-</button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/event/summary-section', () => ({
  __esModule: true,
  default: ({ eventData, tickets, onContinue, disabled, error }: any) => (
    <div data-testid="summary-section">
      Summary Section
      <div data-testid="selected-tickets-count">{tickets.length}</div>
      <div data-testid="is-disabled">{disabled.toString()}</div>
      {error && <div data-testid="error-message">{error}</div>}
      <button
        onClick={onContinue}
        disabled={disabled}
        data-testid="continue-desktop"
      >
        Continue
      </button>
    </div>
  ),
}));

jest.mock('@/components/event/summary-section/mobile', () => ({
  __esModule: true,
  default: ({ eventData, tickets, onContinue, disabled, error }: any) => (
    <div data-testid="summary-section-mobile">
      Summary Section Mobile
      <div data-testid="selected-tickets-count-mobile">{tickets.length}</div>
      <div data-testid="is-disabled-mobile">{disabled.toString()}</div>
      {error && <div data-testid="error-message-mobile">{error}</div>}
      <button
        onClick={onContinue}
        disabled={disabled}
        data-testid="continue-mobile"
      >
        Continue
      </button>
    </div>
  ),
}));

jest.mock('@/components/event/owner-section', () => ({
  __esModule: true,
  default: ({ eventOrganizer, termAndConditions }: any) => (
    <div data-testid="owner-section">
      Owner Section
      <div data-testid="organizer">{eventOrganizer?.name}</div>
      <div data-testid="terms">{termAndConditions}</div>
    </div>
  ),
}));

jest.mock('@/components/layout/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

// Mock utils
jest.mock('@/utils/sticky-observer', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isSticky: false,
    absoluteTop: 0,
    isReady: true,
  })),
}));

// Mock store
jest.mock('@/store/atoms/order', () => ({
  orderBookingAtom: {},
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Event Page', () => {
  const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockUseSWR = require('swr').default as jest.MockedFunction<any>;
  const mockUseAtom = require('jotai').useAtom as jest.MockedFunction<any>;
  const mockAxios = require('axios') as jest.Mocked<any>;
  const mockUseStickyObserver = require('@/utils/sticky-observer')
    .default as jest.MockedFunction<any>;

  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockSetOrderBooking = jest.fn();

  const mockEventData = {
    id: 'event-1',
    title: 'Test Event',
    description: 'Test Description',
    ticketTypes: [
      {
        id: 'ticket-1',
        name: 'VIP Ticket',
        price: 100000,
        max_order_quantity: 5,
        description: 'VIP Description',
        sales_start_date: '2024-01-01',
        quantity: 100,
        purchased_amount: 20,
      },
      {
        id: 'ticket-2',
        name: 'Regular Ticket',
        price: 50000,
        max_order_quantity: 10,
        description: 'Regular Description',
        sales_start_date: '2024-01-01',
        quantity: 200,
        purchased_amount: 50,
      },
    ],
    eventOrganizer: {
      name: 'Test Organizer',
    },
    termAndConditions: 'Test Terms',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ slug: 'test-event' });
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseAtom.mockReturnValue([{}, mockSetOrderBooking]);
    mockUseSWR.mockReturnValue({
      data: mockEventData,
      isLoading: false,
      error: null,
    });
    mockUseStickyObserver.mockReturnValue({
      isSticky: false,
      absoluteTop: 0,
      isReady: true,
    });
  });

  describe('Component Rendering', () => {
    it('should render the event page without crashing', () => {
      expect(() => render(<Event />)).not.toThrow();
    });

    it('should render all main sections', () => {
      render(<Event />);

      expect(screen.getByTestId('event-detail-section')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-list-section')).toBeInTheDocument();
      expect(screen.getByTestId('summary-section')).toBeInTheDocument();
      expect(screen.getByTestId('summary-section-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('owner-section')).toBeInTheDocument();
    });

    it('should render main container with correct classes', () => {
      render(<Event />);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show skeleton when loading', () => {
      mockUseSWR.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(<Event />);

      expect(screen.getByTestId('event-page-skeleton')).toBeInTheDocument();
    });

    it('should show loading overlay when processing', async () => {
      // Mock successful order response
      const mockOrderResponse = {
        data: {
          success: true,
          data: {
            id: 'order-123',
            expiredAt: '2024-12-31T23:59:59Z',
          },
        },
      };
      mockAxios.post.mockResolvedValue(mockOrderResponse);

      render(<Event />);

      // Select a ticket first
      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');
      fireEvent.click(incrementButton!);

      // Simulate loading state
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when event data fails to load', () => {
      mockUseSWR.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch'),
      });

      render(<Event />);

      expect(screen.getByText('Failed to load event data')).toBeInTheDocument();
    });

    it('should show error message when order creation fails', async () => {
      mockAxios.post.mockRejectedValue({
        response: { data: { error: 'Order creation failed' } },
      });

      render(<Event />);

      // Select a ticket first
      const incrementButton = screen
        .getByTestId('ticket-ticket-1')
        .querySelector('button');
      fireEvent.click(incrementButton!);

      // Try to continue
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Order creation failed'
        );
      });
    });
  });

  describe('Ticket Management', () => {
    it('should initialize tickets from event data', () => {
      render(<Event />);

      expect(screen.getByTestId('ticket-ticket-1')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-ticket-2')).toBeInTheDocument();
    });

    it('should display ticket information correctly', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 0');
    });

    it('should handle ticket count increment', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');

      fireEvent.click(incrementButton!);

      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 1');
    });

    it('should handle ticket count decrement', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');
      const decrementButton = ticket1.querySelectorAll('button')[1];

      // First increment
      fireEvent.click(incrementButton!);
      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 1');

      // Then decrement
      fireEvent.click(decrementButton!);
      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 0');
    });

    it('should not allow negative ticket count', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const decrementButton = ticket1.querySelectorAll('button')[1];

      fireEvent.click(decrementButton!);

      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 0');
    });

    it('should reset other tickets when one is selected', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const ticket2 = screen.getByTestId('ticket-ticket-2');

      // Select first ticket
      const incrementButton1 = ticket1.querySelector('button');
      fireEvent.click(incrementButton1!);
      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 1');
      expect(ticket2).toHaveTextContent('Regular Ticket - Count: 0');

      // Select second ticket
      const incrementButton2 = ticket2.querySelector('button');
      fireEvent.click(incrementButton2!);
      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 0');
      expect(ticket2).toHaveTextContent('Regular Ticket - Count: 1');
    });
  });

  describe('Summary Section', () => {
    it('should show correct selected tickets count', () => {
      render(<Event />);

      expect(screen.getByTestId('selected-tickets-count')).toHaveTextContent(
        '0'
      );
      expect(
        screen.getByTestId('selected-tickets-count-mobile')
      ).toHaveTextContent('0');
    });

    it('should update selected tickets count when tickets are selected', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');

      fireEvent.click(incrementButton!);

      expect(screen.getByTestId('selected-tickets-count')).toHaveTextContent(
        '1'
      );
      expect(
        screen.getByTestId('selected-tickets-count-mobile')
      ).toHaveTextContent('1');
    });

    it('should disable continue button when no tickets selected', () => {
      render(<Event />);

      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
      expect(screen.getByTestId('is-disabled-mobile')).toHaveTextContent(
        'true'
      );
    });

    it('should enable continue button when tickets are selected', () => {
      render(<Event />);

      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');

      fireEvent.click(incrementButton!);

      expect(screen.getByTestId('is-disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('is-disabled-mobile')).toHaveTextContent(
        'false'
      );
    });
  });

  describe('Order Creation', () => {
    it('should create order successfully', async () => {
      const mockOrderResponse = {
        data: {
          success: true,
          data: {
            id: 'order-123',
            expiredAt: '2024-12-31T23:59:59Z',
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockOrderResponse);

      render(<Event />);

      // Select a ticket
      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');
      fireEvent.click(incrementButton!);

      // Continue to order
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/order/create', {
          tickets: [
            {
              id: 'ticket-1',
              quantity: 1,
            },
          ],
        });
      });

      expect(mockSetOrderBooking).toHaveBeenCalledWith({
        orderId: 'order-123',
        expiredAt: '2024-12-31T23:59:59Z',
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/event/test-event/order');
    });
  });

  describe('Event Detail Section', () => {
    it('should render event detail section with data', () => {
      render(<Event />);

      expect(screen.getByTestId('event-detail-section')).toBeInTheDocument();
    });

    it('should handle choose ticket button click', () => {
      render(<Event />);

      const chooseTicketButton = screen.getByText('Choose Ticket');
      fireEvent.click(chooseTicketButton);

      // The scrollToTickets function should be called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    });
  });

  describe('Owner Section', () => {
    it('should render owner section with organizer data', () => {
      render(<Event />);

      expect(screen.getByTestId('owner-section')).toBeInTheDocument();
      expect(screen.getByTestId('organizer')).toHaveTextContent(
        'Test Organizer'
      );
      expect(screen.getByTestId('terms')).toHaveTextContent('Test Terms');
    });
  });

  describe('Sticky Behavior', () => {
    it('should apply sticky classes when sticky', () => {
      mockUseStickyObserver.mockReturnValue({
        isSticky: true,
        absoluteTop: 0,
        isReady: true,
      });

      render(<Event />);

      const summarySection = screen
        .getByTestId('summary-section')
        .closest('div[class*="sticky"]');
      expect(summarySection).toHaveClass('sticky');
    });

    it('should apply absolute positioning when not sticky', () => {
      mockUseStickyObserver.mockReturnValue({
        isSticky: false,
        absoluteTop: 100,
        isReady: true,
      });

      render(<Event />);

      const summarySection = screen
        .getByTestId('summary-section')
        .closest('div[class*="absolute"]');
      expect(summarySection).toHaveClass('absolute');
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile summary section', () => {
      render(<Event />);

      expect(screen.getByTestId('summary-section-mobile')).toBeInTheDocument();
    });

    it('should render desktop summary section', () => {
      render(<Event />);

      expect(screen.getByTestId('summary-section')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should handle complete user flow', async () => {
      const mockOrderResponse = {
        data: {
          success: true,
          data: {
            id: 'order-123',
            expiredAt: '2024-12-31T23:59:59Z',
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockOrderResponse);

      render(<Event />);

      // 1. Select a ticket
      const ticket1 = screen.getByTestId('ticket-ticket-1');
      const incrementButton = ticket1.querySelector('button');
      fireEvent.click(incrementButton!);

      // 2. Verify ticket is selected
      expect(ticket1).toHaveTextContent('VIP Ticket - Count: 1');
      expect(screen.getByTestId('selected-tickets-count')).toHaveTextContent(
        '1'
      );

      // 3. Continue to order
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      // 4. Verify order creation and navigation
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/event/test-event/order');
      });
    });
  });
});
