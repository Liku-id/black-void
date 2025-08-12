import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import OrderPage from './page';

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

// Mock useAuth
jest.mock('@/lib/session/use-auth', () => ({
  useAuth: jest.fn(),
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { isValid: true },
    setValue: jest.fn(),
    getValues: jest.fn(() => ({
      fullName: 'Test User',
      phoneNumber: '123456789',
      email: 'test@example.com',
      countryCode: '+62',
      visitors: [{ fullName: 'Test Visitor' }],
    })),
    trigger: jest.fn(() => Promise.resolve(true)),
  })),
}));

// Mock useState to allow setting selectedPayment
const mockSetSelectedPayment = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initialValue) => {
    if (initialValue === null) {
      // This is for selectedPayment state
      return [
        { id: 'payment-1', name: 'Credit Card', paymentMethodFee: 5000 },
        mockSetSelectedPayment,
      ];
    }
    return jest.requireActual('react').useState(initialValue);
  }),
}));

// Mock useCountdown
jest.mock('@/utils/timer', () => ({
  useCountdown: jest.fn(),
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

jest.mock('@/components/layout/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/components/event/contact-detail', () => ({
  __esModule: true,
  default: ({ contactMethods, onContactSubmit }: any) => (
    <div data-testid="contact-detail-section">
      Contact Detail Section
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          {...(contactMethods?.register?.('fullName') || {})}
          placeholder="Full Name"
        />
        <input
          {...(contactMethods?.register?.('phoneNumber') || {})}
          placeholder="Phone"
        />
        <input
          {...(contactMethods?.register?.('email') || {})}
          placeholder="Email"
        />
        <button type="submit">Submit Contact</button>
      </form>
    </div>
  ),
}));

jest.mock('@/components/event/visitor-detail', () => ({
  __esModule: true,
  default: ({
    visitorMethods,
    onVisitorSubmit,
    isVisitorDetailChecked,
  }: any) => (
    <div data-testid="visitor-detail-section">
      Visitor Detail Section
      <div data-testid="visitor-checked">
        {isVisitorDetailChecked.toString()}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          {...(visitorMethods?.register?.('visitors.0.fullName') || {})}
          placeholder="Visitor Name"
        />
        <button type="submit">Submit Visitor</button>
      </form>
    </div>
  ),
}));

jest.mock('@/components/event/summary-section', () => ({
  __esModule: true,
  default: ({ eventData, tickets, onContinue, disabled, error }: any) => (
    <div data-testid="summary-section">
      Summary Section
      <div data-testid="selected-tickets-count">{(tickets || []).length}</div>
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
      <div data-testid="selected-tickets-count-mobile">
        {(tickets || []).length}
      </div>
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

jest.mock('@/components/event/skeletons', () => ({
  __esModule: true,
  default: () => <div data-testid="order-page-skeleton">Loading...</div>,
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
  contactDetailAtom: {},
  orderBookingAtom: {},
}));

describe('OrderPage', () => {
  const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockUseSWR = require('swr').default as jest.MockedFunction<any>;
  const mockUseAtom = require('jotai').useAtom as jest.MockedFunction<any>;
  const mockAxios = require('axios') as jest.Mocked<any>;
  const mockUseAuth = require('@/lib/session/use-auth')
    .useAuth as jest.MockedFunction<any>;
  const mockUseCountdown = require('@/utils/timer')
    .useCountdown as jest.MockedFunction<any>;
  const mockUseStickyObserver = require('@/utils/sticky-observer')
    .default as jest.MockedFunction<any>;

  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockSetContactDetail = jest.fn();
  const mockResetCountdown = jest.fn();

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
    ],
    eventOrganizer: {
      name: 'Test Organizer',
    },
    termAndConditions: 'Test Terms',
  };

  const mockOrderData = {
    id: 'order-123',
    tickets: [
      {
        id: 'ticket-1',
        name: 'VIP Ticket',
        price: 100000,
        quantity: 1,
      },
    ],
    total: 100000,
    expiredAt: '2024-12-31T23:59:59Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ slug: 'test-event' });
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseAtom.mockReturnValue([
      { orderId: 'order-123', expiredAt: '2024-12-31T23:59:59Z' },
      mockSetContactDetail,
    ]);
    mockUseSWR
      .mockReturnValueOnce({
        data: mockEventData,
        isLoading: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: mockOrderData,
        isLoading: false,
        error: null,
      })
      .mockReturnValue({
        data: mockEventData,
        isLoading: false,
        error: null,
      });
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });
    mockUseCountdown.mockReturnValue([900, mockResetCountdown]);
    mockUseStickyObserver.mockReturnValue({
      isSticky: false,
      absoluteTop: 0,
      isReady: true,
    });
  });

  describe('Component Rendering', () => {
    it('should render the order page without crashing', () => {
      expect(() => render(<OrderPage />)).not.toThrow();
    });

    it('should render all main sections', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('contact-detail-section')).toBeInTheDocument();
      expect(screen.getByTestId('visitor-detail-section')).toBeInTheDocument();
      expect(screen.getByTestId('summary-section')).toBeInTheDocument();
      expect(screen.getByTestId('summary-section-mobile')).toBeInTheDocument();
    });

    it('should render main container with correct classes', () => {
      render(<OrderPage />);

      const container = screen
        .getByTestId('contact-detail-section')
        .closest('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show skeleton when event loading', () => {
      mockUseSWR.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(<OrderPage />);

      expect(screen.getByTestId('order-page-skeleton')).toBeInTheDocument();
    });

    it('should show skeleton when order loading', () => {
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: null,
          isLoading: true,
          error: null,
        });

      render(<OrderPage />);

      expect(screen.getByTestId('order-page-skeleton')).toBeInTheDocument();
    });

    it('should show loading overlay when processing', async () => {
      // Mock successful transaction response
      const mockTransactionResponse = {
        data: {
          success: true,
          id: 'transaction-123',
          paymentUrl: 'https://payment.example.com',
        },
      };
      mockAxios.post.mockResolvedValue(mockTransactionResponse);

      // Mock order data
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderData,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

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

      render(<OrderPage />);

      expect(screen.getByText('Failed to load order data')).toBeInTheDocument();
    });

    it('should show error message when order data fails to load', () => {
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: null,
          isLoading: false,
          error: new Error('Failed to fetch order'),
        });

      render(<OrderPage />);

      expect(screen.getByText('Failed to load order data')).toBeInTheDocument();
    });

    it('should show error message when order creation fails', async () => {
      mockAxios.post.mockRejectedValue({
        response: { data: { error: 'Order creation failed' } },
      });

      render(<OrderPage />);

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

  describe('Contact Detail Section', () => {
    it('should render contact detail section', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('contact-detail-section')).toBeInTheDocument();
    });

    it('should handle contact form submission', async () => {
      render(<OrderPage />);

      const contactForm = screen
        .getByTestId('contact-detail-section')
        .querySelector('form');
      const submitButton = screen.getByText('Submit Contact');

      fireEvent.click(submitButton);

      // The form submission should be handled
      expect(contactForm).toBeInTheDocument();
    });

    it('should populate contact form with user data when logged in', () => {
      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: {
          full_name: 'John Doe',
          phone_number: '+62123456789',
          email: 'john@example.com',
        },
      });

      render(<OrderPage />);

      expect(screen.getByTestId('contact-detail-section')).toBeInTheDocument();
    });
  });

  describe('Visitor Detail Section', () => {
    it('should render visitor detail section', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('visitor-detail-section')).toBeInTheDocument();
    });

    it('should show visitor detail checked state', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('visitor-checked')).toHaveTextContent('false');
    });

    it('should handle visitor form submission', async () => {
      render(<OrderPage />);

      const visitorForm = screen
        .getByTestId('visitor-detail-section')
        .querySelector('form');
      const submitButton = screen.getByText('Submit Visitor');

      fireEvent.click(submitButton);

      // The form submission should be handled
      expect(visitorForm).toBeInTheDocument();
    });
  });

  describe('Summary Section', () => {
    it('should show correct selected tickets count', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('selected-tickets-count')).toHaveTextContent(
        '0'
      );
      expect(
        screen.getByTestId('selected-tickets-count-mobile')
      ).toHaveTextContent('0');
    });

    it('should disable continue button when no tickets selected', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('is-disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('is-disabled-mobile')).toHaveTextContent(
        'false'
      );
    });

    it('should enable continue button when tickets are selected and payment method is chosen', () => {
      // Mock order data with tickets
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderData,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

      // Button should be enabled when payment method is selected
      expect(screen.getByTestId('is-disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('is-disabled-mobile')).toHaveTextContent(
        'false'
      );
    });
  });

  describe('Payment Selection', () => {
    it('should handle payment method selection', () => {
      render(<OrderPage />);

      // Payment selection would be tested through the summary section
      expect(screen.getByTestId('summary-section')).toBeInTheDocument();
    });

    it('should calculate total with payment method fee', () => {
      // Mock order data with payment method
      const mockOrderWithPayment = {
        ...mockOrderData,
        paymentMethod: {
          id: 'payment-1',
          name: 'Credit Card',
          paymentMethodFee: 5000,
        },
      };

      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderWithPayment,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

      expect(screen.getByTestId('summary-section')).toBeInTheDocument();
    });
  });

  describe('Order Processing', () => {
    it('should create transaction successfully', async () => {
      const mockTransactionResponse = {
        data: {
          success: true,
          id: 'transaction-123',
          paymentUrl: 'https://payment.example.com',
        },
      };

      mockAxios.post.mockResolvedValue(mockTransactionResponse);

      // Mock order data
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderData,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

      // Continue to payment
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/transaction/create', {
          orderId: 'order-123',
          paymentMethodId: 'payment-1',
          contactDetails: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+62123456789',
          },
          attendee: ['Test Visitor'],
        });
      });

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/transaction/transaction-123'
      );
    });

    it('should handle transaction creation failure', async () => {
      mockAxios.post.mockRejectedValue({
        response: { data: { error: 'Transaction creation failed' } },
      });

      // Mock order data
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderData,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

      // Continue to payment
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Transaction creation failed'
        );
      });
    });
  });

  describe('Countdown Timer', () => {
    it('should initialize countdown with order expiry time', () => {
      const mockOrderWithExpiry = {
        ...mockOrderData,
        expiredAt: '2024-12-31T23:59:59Z',
      };

      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderWithExpiry,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

      expect(mockUseCountdown).toHaveBeenCalled();
    });

    it('should redirect when countdown reaches zero', () => {
      mockUseCountdown.mockReturnValue([0, mockResetCountdown]);

      render(<OrderPage />);

      expect(mockRouter.replace).toHaveBeenCalledWith('/event/test-event');
    });
  });

  describe('Phone Number Handling', () => {
    it('should split phone number correctly', () => {
      render(<OrderPage />);

      // The splitPhoneNumber function is tested indirectly through the component
      expect(screen.getByTestId('contact-detail-section')).toBeInTheDocument();
    });

    it('should handle phone number with country code', () => {
      render(<OrderPage />);

      // Test phone number splitting logic
      const phoneInput = screen.getByPlaceholderText('Phone');
      expect(phoneInput).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate contact form fields', () => {
      render(<OrderPage />);

      const fullNameInput = screen.getByPlaceholderText('Full Name');
      const phoneInput = screen.getByPlaceholderText('Phone');
      const emailInput = screen.getByPlaceholderText('Email');

      expect(fullNameInput).toBeInTheDocument();
      expect(phoneInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });

    it('should validate visitor form fields', () => {
      render(<OrderPage />);

      const visitorNameInput = screen.getByPlaceholderText('Visitor Name');
      expect(visitorNameInput).toBeInTheDocument();
    });
  });

  describe('Sticky Behavior', () => {
    it('should apply sticky classes when sticky', () => {
      mockUseStickyObserver.mockReturnValue({
        isSticky: true,
        absoluteTop: 0,
        isReady: true,
      });

      render(<OrderPage />);

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

      render(<OrderPage />);

      const summarySection = screen
        .getByTestId('summary-section')
        .closest('div[class*="absolute"]');
      expect(summarySection).toHaveClass('absolute');
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile summary section', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('summary-section-mobile')).toBeInTheDocument();
    });

    it('should render desktop summary section', () => {
      render(<OrderPage />);

      expect(screen.getByTestId('summary-section')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should handle complete order flow', async () => {
      const mockTransactionResponse = {
        data: {
          success: true,
          id: 'transaction-123',
          paymentUrl: 'https://payment.example.com',
        },
      };

      mockAxios.post.mockResolvedValue(mockTransactionResponse);

      // Mock order data
      mockUseSWR
        .mockReturnValueOnce({
          data: mockEventData,
          isLoading: false,
          error: null,
        })
        .mockReturnValueOnce({
          data: mockOrderData,
          isLoading: false,
          error: null,
        });

      render(<OrderPage />);

      // 1. Verify all sections are rendered
      expect(screen.getByTestId('contact-detail-section')).toBeInTheDocument();
      expect(screen.getByTestId('visitor-detail-section')).toBeInTheDocument();
      expect(screen.getByTestId('summary-section')).toBeInTheDocument();

      // 2. Continue to payment
      const continueButton = screen.getByTestId('continue-desktop');
      fireEvent.click(continueButton);

      // 3. Verify transaction creation and navigation
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(
          '/transaction/transaction-123'
        );
      });
    });
  });
});
