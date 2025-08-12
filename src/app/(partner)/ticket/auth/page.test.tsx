import { render, screen } from '@testing-library/react';
import TicketScannerPage from './page';

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc: any) => {
    const Component = () => <div data-testid="login-form">Login Form</div>;
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

// Mock the components
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, size, type, className, ...props }: any) => (
    <div className={className} data-size={size} data-type={type} {...props}>
      {children}
    </div>
  ),
}));

describe('TicketScannerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the page without crashing', () => {
      expect(() => render(<TicketScannerPage />)).not.toThrow();
    });

    it('should render the content wrapper with correct classes', () => {
      render(<TicketScannerPage />);

      const contentWrapper =
        screen.getByText('Hi partner 👋').parentElement?.parentElement;
      expect(contentWrapper).toHaveClass('w-full max-w-sm px-4');
    });
  });

  describe('Typography Components', () => {
    it('should render the greeting text', () => {
      render(<TicketScannerPage />);

      expect(screen.getByText('Hi partner 👋')).toBeInTheDocument();
    });

    it('should render the greeting with correct classes', () => {
      render(<TicketScannerPage />);

      const greeting = screen.getByText('Hi partner 👋');
      expect(greeting).toHaveClass('mb-4');
    });

    it('should render the heading text', () => {
      render(<TicketScannerPage />);

      // Since the text is split into individual spans, we need to check for the container
      const headingContainer = screen.getByText('R').closest('div');
      expect(headingContainer).toBeInTheDocument();
    });

    it('should render the heading with correct attributes', () => {
      render(<TicketScannerPage />);

      const heading = screen.getByText('R').closest('div');
      expect(heading).toHaveAttribute('data-size', '41');
      expect(heading).toHaveAttribute('data-type', 'heading');
      expect(heading).toHaveClass('font-normal uppercase');
    });
  });

  describe('Dynamic Login Form', () => {
    it('should render the LoginForm component', () => {
      render(<TicketScannerPage />);

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByText('Login Form')).toBeInTheDocument();
    });
  });

  describe('Text Animation', () => {
    it('should render each character of "Ready to Scan?" as separate spans', () => {
      render(<TicketScannerPage />);

      const heading = screen.getByText('R').closest('div');
      const spans = heading?.querySelectorAll('span.hover-text');

      // Should have 14 spans (one for each character in "Ready to Scan?" including spaces)
      expect(spans).toHaveLength(14);
    });

    it('should render each character with hover-text class', () => {
      render(<TicketScannerPage />);

      const heading = screen.getByText('R').closest('div');
      const spans = heading?.querySelectorAll('span.hover-text');

      spans?.forEach((span) => {
        expect(span).toHaveClass('hover-text');
      });
    });

    it('should render the correct characters', () => {
      render(<TicketScannerPage />);

      const heading = screen.getByText('R').closest('div');
      const spans = heading?.querySelectorAll('span.hover-text');

      const expectedText = 'Ready to Scan?';
      spans?.forEach((span, index) => {
        expect(span.textContent).toBe(expectedText[index]);
      });
    });
  });

  describe('Component Structure', () => {
    it('should render all required elements', () => {
      render(<TicketScannerPage />);

      // Check that all main elements are present
      expect(screen.getByText('Hi partner 👋')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument(); // First character of "Ready to Scan?"
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should have the correct layout structure', () => {
      const { container } = render(<TicketScannerPage />);

      // Should have a main container with the specified classes
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        'relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-black text-white'
      );
    });
  });

  describe('Integration', () => {
    it('should work with the mocked components', () => {
      render(<TicketScannerPage />);

      expect(screen.getByText('Hi partner 👋')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument(); // First character of "Ready to Scan?"
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should handle the dynamic import correctly', () => {
      render(<TicketScannerPage />);

      const loginForm = screen.getByTestId('login-form');
      expect(loginForm).toBeInTheDocument();
    });
  });
});
