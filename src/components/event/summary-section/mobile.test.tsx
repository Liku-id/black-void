import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SummarySectionMobile from './mobile';

// Mocks
jest.mock('next/navigation', () => ({
  usePathname: () => '/event/slug/order',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/utils/formatter', () => ({
  formatRupiah: (val: number) => `Rp ${val}`,
  calculatePriceWithPartnership: (price: number, info: any) => price,
}));

// Mock sub-components to focus on Mobile logic
jest.mock('./ticket-list', () => () => <div data-testid="ticket-list">Ticket List</div>);
jest.mock('./price-detail', () => () => <div data-testid="price-detail">Price Detail</div>);
jest.mock('./payment-method', () => ({ setSelectedPayment }: any) => (
  <div data-testid="payment-method">
    Payment Method Accordion
    <button onClick={() => setSelectedPayment({ id: 'pm1', name: 'Mock PM', paymentMethodFee: 0 })}>Select PM</button>
  </div>
));

jest.mock('@/components', () => ({
  Box: ({ children, className, onClick, id }: any) => (
    <div id={id} className={className} onClick={onClick}>
      {children}
    </div>
  ),
  Typography: ({ children }: any) => <span>{children}</span>,
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('SummarySectionMobile', () => {
  const mockTickets = [
    { id: '1', name: 'Ticket 1', count: 2, price: '100000', partnership_info: null },
  ];
  const mockEventData = {
    adminFee: 5000,
    tax: 11, // 11%
    paymentMethods: [],
  };
  const mockOnContinue = jest.fn();
  const mockSetSelectedPayment = jest.fn();

  it('renders order details correctly', () => {
    render(
      <SummarySectionMobile
        eventData={mockEventData}
        tickets={mockTickets}
        onContinue={mockOnContinue}
        disabled={false}
        error=""
        selectedPayment={null}
        setSelectedPayment={mockSetSelectedPayment}
      />
    );

    // Order Details
    expect(screen.getByText('Order details')).toBeInTheDocument();
    expect(screen.getByText('2 Ticket')).toBeInTheDocument();
  });

  it('toggles detail visibility', () => {
    render(
      <SummarySectionMobile
        eventData={mockEventData}
        tickets={mockTickets}
        onContinue={mockOnContinue}
        disabled={false}
        error=""
        selectedPayment={null}
        setSelectedPayment={mockSetSelectedPayment}
      />
    );

    const toggleBtn = screen.getByText('See Detail');
    fireEvent.click(toggleBtn);

    expect(screen.getByText('Hide Detail')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
    expect(screen.getByTestId('price-detail')).toBeInTheDocument();
  });

  it('shows payment method selection when clicked', () => {
    render(
      <SummarySectionMobile
        eventData={mockEventData}
        tickets={mockTickets}
        onContinue={mockOnContinue}
        disabled={false}
        error=""
        selectedPayment={null}
        setSelectedPayment={mockSetSelectedPayment}
      />
    );

    // Initially "Choose Payment Method"
    const pmSelector = screen.getByText('Choose Payment Method');
    // Parent box has onclick
    // We mocked hierarchy nicely?
    // Box is mocked as div. Text is span.
    // Selector uses Typography inside Box.
    // Need to click the Box containing the text.
    fireEvent.click(pmSelector.closest('div')!);

    // Should switch to Payment Method View
    expect(screen.getByText('Choose Payment method')).toBeInTheDocument();
    expect(screen.getAllByTestId('payment-method')).toHaveLength(2); // VA and QRIS accordions
  });

  it('calls onContinue when button clicked', () => {
    render(
      <SummarySectionMobile
        eventData={mockEventData}
        tickets={mockTickets}
        onContinue={mockOnContinue}
        disabled={false}
        error=""
        selectedPayment={null}
        setSelectedPayment={mockSetSelectedPayment}
      />
    );

    const continueBtn = screen.getByText('Continue');
    fireEvent.click(continueBtn);

    expect(mockOnContinue).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(
      <SummarySectionMobile
        eventData={mockEventData}
        tickets={mockTickets}
        onContinue={mockOnContinue}
        disabled={false}
        error="Payment Failed"
        selectedPayment={null}
        setSelectedPayment={mockSetSelectedPayment}
      />
    );

    expect(screen.getByText('Payment Failed')).toBeInTheDocument();
  });
});
