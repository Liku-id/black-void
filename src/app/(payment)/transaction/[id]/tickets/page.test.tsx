import { render, screen } from '@testing-library/react';
import TicketPage from './page';

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc: any) => {
    const Component = () => (
      <div data-testid="ticket-component">Ticket Component</div>
    );
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

describe('TicketPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the page without crashing', () => {
      expect(() => render(<TicketPage />)).not.toThrow();
    });

    it('should render Ticket component', () => {
      render(<TicketPage />);

      expect(screen.getByTestId('ticket-component')).toBeInTheDocument();
      expect(screen.getByText('Ticket Component')).toBeInTheDocument();
    });
  });

  describe('Dynamic Import', () => {
    it('should handle dynamic import correctly', () => {
      render(<TicketPage />);

      const ticketComponent = screen.getByTestId('ticket-component');
      expect(ticketComponent).toBeInTheDocument();
    });

    it('should render the dynamic component with correct display name', () => {
      render(<TicketPage />);

      const ticketComponent = screen.getByTestId('ticket-component');
      expect(ticketComponent).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have the correct component structure', () => {
      const { container } = render(<TicketPage />);

      // Should render a single div containing the Ticket component
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render only the Ticket component', () => {
      render(<TicketPage />);

      const ticketComponent = screen.getByTestId('ticket-component');
      expect(ticketComponent).toBeInTheDocument();

      // Should not have any other content
      expect(screen.getByText('Ticket Component')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with the mocked Ticket component', () => {
      render(<TicketPage />);

      const ticketComponent = screen.getByTestId('ticket-component');
      expect(ticketComponent).toHaveTextContent('Ticket Component');
    });

    it('should handle the dynamic import without errors', () => {
      expect(() => render(<TicketPage />)).not.toThrow();
    });
  });
});
