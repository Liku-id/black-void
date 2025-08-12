import { render, screen } from '@testing-library/react';
import TermAndConditionPage from './page';

// Mock the TermAndCondition component
jest.mock('@/components/legal/term-and-condition', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="term-and-condition">Terms and Conditions Content</div>
  ),
}));

describe('TermAndConditionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render TermAndCondition component', () => {
      render(<TermAndConditionPage />);

      expect(screen.getByTestId('term-and-condition')).toBeInTheDocument();
      expect(
        screen.getByText('Terms and Conditions Content')
      ).toBeInTheDocument();
    });

    it('should render the component without crashing', () => {
      expect(() => render(<TermAndConditionPage />)).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should render the TermAndCondition component as the main content', () => {
      render(<TermAndConditionPage />);

      const termAndCondition = screen.getByTestId('term-and-condition');
      expect(termAndCondition).toBeInTheDocument();
    });

    it('should have the correct component structure', () => {
      const { container } = render(<TermAndConditionPage />);

      // Should render a single div containing the TermAndCondition component
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with the mocked TermAndCondition component', () => {
      render(<TermAndConditionPage />);

      const termAndCondition = screen.getByTestId('term-and-condition');
      expect(termAndCondition).toHaveTextContent(
        'Terms and Conditions Content'
      );
    });
  });
});
