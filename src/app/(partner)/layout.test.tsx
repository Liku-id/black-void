import { render, screen } from '@testing-library/react';
import ScannerLayout from './layout';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, height, width, className, priority }: any) => (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={className}
      data-priority={priority}
    />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, 'aria-label': ariaLabel }: any) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

// Mock the logo import
jest.mock('@/assets/logo/white-logo.svg', () => 'mocked-logo.svg');

describe('ScannerLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render children correctly', () => {
      const testMessage = 'Test Child Content';
      render(
        <ScannerLayout>
          <div>{testMessage}</div>
        </ScannerLayout>
      );

      expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ScannerLayout>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ScannerLayout>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      const NestedComponent = () => <div>Nested Content</div>;
      render(
        <ScannerLayout>
          <div>
            <NestedComponent />
          </div>
        </ScannerLayout>
      );

      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('Logo and Navigation', () => {
    it('should render logo with correct attributes', () => {
      render(
        <ScannerLayout>
          <div>Content</div>
        </ScannerLayout>
      );

      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mocked-logo.svg');
      expect(logo).toHaveAttribute('height', '32');
      expect(logo).toHaveAttribute('width', '120');
      expect(logo).toHaveClass('absolute top-6 left-6 z-50 h-8 w-auto');
      expect(logo).toHaveAttribute('data-priority', 'true');
    });

    it('should render home link with correct attributes', () => {
      render(
        <ScannerLayout>
          <div>Content</div>
        </ScannerLayout>
      );

      const homeLink = screen.getByLabelText('Home');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should contain logo within home link', () => {
      render(
        <ScannerLayout>
          <div>Content</div>
        </ScannerLayout>
      );

      const homeLink = screen.getByLabelText('Home');
      const logo = screen.getByAltText('Logo');
      expect(homeLink).toContainElement(logo);
    });
  });

  describe('Layout Structure', () => {
    it('should render main element', () => {
      render(
        <ScannerLayout>
          <div>Content</div>
        </ScannerLayout>
      );

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should maintain component hierarchy', () => {
      render(
        <ScannerLayout>
          <div data-testid="child">Child Content</div>
        </ScannerLayout>
      );

      const main = screen.getByRole('main');
      const child = screen.getByTestId('child');
      expect(main).toContainElement(child);
    });
  });

  describe('Props Interface', () => {
    it('should accept children prop', () => {
      const TestComponent = () => (
        <ScannerLayout>
          <span>Test Children</span>
        </ScannerLayout>
      );
      render(<TestComponent />);
      expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<ScannerLayout>{null}</ScannerLayout>);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(<ScannerLayout>{undefined}</ScannerLayout>);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with complex component trees', () => {
      const ComplexChild = () => (
        <div>
          <header>Header</header>
          <main>
            <section>Section 1</section>
            <section>Section 2</section>
          </main>
          <footer>Footer</footer>
        </div>
      );
      render(
        <ScannerLayout>
          <ComplexChild />
        </ScannerLayout>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('should handle conditional rendering', () => {
      const ConditionalChild = ({ show }: { show: boolean }) => (
        <div>
          {show && <div>Conditional Content</div>}
          <div>Always Visible</div>
        </div>
      );
      const { rerender } = render(
        <ScannerLayout>
          <ConditionalChild show={false} />
        </ScannerLayout>
      );
      expect(screen.queryByText('Conditional Content')).not.toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();
      rerender(
        <ScannerLayout>
          <ConditionalChild show={true} />
        </ScannerLayout>
      );
      expect(screen.getByText('Conditional Content')).toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();
    });
  });
});
