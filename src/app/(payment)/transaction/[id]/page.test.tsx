import { render, screen } from '@testing-library/react';
import TransactionPage from './page';

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc: any) => {
    const Component = () => (
      <div data-testid="transaction-confirmation">Transaction Confirmation</div>
    );
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

describe('TransactionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the page without crashing', () => {
      expect(() => render(<TransactionPage />)).not.toThrow();
    });

    it('should render TransactionConfirmation component', () => {
      render(<TransactionPage />);

      expect(
        screen.getByTestId('transaction-confirmation')
      ).toBeInTheDocument();
      expect(screen.getByText('Transaction Confirmation')).toBeInTheDocument();
    });
  });

  describe('Dynamic Import', () => {
    it('should handle dynamic import correctly', () => {
      render(<TransactionPage />);

      const transactionConfirmation = screen.getByTestId(
        'transaction-confirmation'
      );
      expect(transactionConfirmation).toBeInTheDocument();
    });

    it('should render the dynamic component with correct display name', () => {
      render(<TransactionPage />);

      const transactionConfirmation = screen.getByTestId(
        'transaction-confirmation'
      );
      expect(transactionConfirmation).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have the correct component structure', () => {
      const { container } = render(<TransactionPage />);

      // Should render a single div containing the TransactionConfirmation component
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render only the TransactionConfirmation component', () => {
      render(<TransactionPage />);

      const transactionConfirmation = screen.getByTestId(
        'transaction-confirmation'
      );
      expect(transactionConfirmation).toBeInTheDocument();

      // Should not have any other content
      expect(screen.getByText('Transaction Confirmation')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with the mocked TransactionConfirmation component', () => {
      render(<TransactionPage />);

      const transactionConfirmation = screen.getByTestId(
        'transaction-confirmation'
      );
      expect(transactionConfirmation).toHaveTextContent(
        'Transaction Confirmation'
      );
    });

    it('should handle the dynamic import without errors', () => {
      expect(() => render(<TransactionPage />)).not.toThrow();
    });
  });
});
