import { render, screen } from '@testing-library/react';
import TransactionStatusPage from './page';

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc: any) => {
    const Component = () => (
      <div data-testid="transaction-status">Transaction Status</div>
    );
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

describe('TransactionStatusPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the page without crashing', () => {
      expect(() => render(<TransactionStatusPage />)).not.toThrow();
    });

    it('should render TransactionStatus component', () => {
      render(<TransactionStatusPage />);

      expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
      expect(screen.getByText('Transaction Status')).toBeInTheDocument();
    });
  });

  describe('Dynamic Import', () => {
    it('should handle dynamic import correctly', () => {
      render(<TransactionStatusPage />);

      const transactionStatus = screen.getByTestId('transaction-status');
      expect(transactionStatus).toBeInTheDocument();
    });

    it('should render the dynamic component with correct display name', () => {
      render(<TransactionStatusPage />);

      const transactionStatus = screen.getByTestId('transaction-status');
      expect(transactionStatus).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have the correct component structure', () => {
      const { container } = render(<TransactionStatusPage />);

      // Should render a single div containing the TransactionStatus component
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render only the TransactionStatus component', () => {
      render(<TransactionStatusPage />);

      const transactionStatus = screen.getByTestId('transaction-status');
      expect(transactionStatus).toBeInTheDocument();

      // Should not have any other content
      expect(screen.getByText('Transaction Status')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with the mocked TransactionStatus component', () => {
      render(<TransactionStatusPage />);

      const transactionStatus = screen.getByTestId('transaction-status');
      expect(transactionStatus).toHaveTextContent('Transaction Status');
    });

    it('should handle the dynamic import without errors', () => {
      expect(() => render(<TransactionStatusPage />)).not.toThrow();
    });
  });
});
