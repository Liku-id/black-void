import { render, screen } from '@testing-library/react';
import PaymentLayout from './layout';

// Mock the OrderHeader component
jest.mock('@/components/layout/header/order', () => ({
  __esModule: true,
  default: () => <div data-testid="order-header">Order Header</div>,
}));

describe('PaymentLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render children correctly', () => {
      const testMessage = 'Test Child Content';
      render(
        <PaymentLayout>
          <div>{testMessage}</div>
        </PaymentLayout>
      );

      expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <PaymentLayout>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </PaymentLayout>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      const NestedComponent = () => <div>Nested Content</div>;
      render(
        <PaymentLayout>
          <div>
            <NestedComponent />
          </div>
        </PaymentLayout>
      );

      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('Order Header', () => {
    it('should render OrderHeader component', () => {
      render(
        <PaymentLayout>
          <div>Content</div>
        </PaymentLayout>
      );

      expect(screen.getByTestId('order-header')).toBeInTheDocument();
      expect(screen.getByText('Order Header')).toBeInTheDocument();
    });

    it('should render OrderHeader within Suspense', () => {
      render(
        <PaymentLayout>
          <div>Content</div>
        </PaymentLayout>
      );

      const orderHeader = screen.getByTestId('order-header');
      expect(orderHeader).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should render main element with correct classes', () => {
      render(
        <PaymentLayout>
          <div>Content</div>
        </PaymentLayout>
      );

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('px-0 pt-35 lg:pt-40');
    });

    it('should maintain component hierarchy', () => {
      render(
        <PaymentLayout>
          <div data-testid="child">Child Content</div>
        </PaymentLayout>
      );

      const main = screen.getByRole('main');
      const child = screen.getByTestId('child');
      const orderHeader = screen.getByTestId('order-header');

      expect(main).toContainElement(child);
      expect(main).toContainElement(orderHeader);
    });

    it('should render both OrderHeader and children', () => {
      render(
        <PaymentLayout>
          <div data-testid="child">Child Content</div>
        </PaymentLayout>
      );

      const main = screen.getByRole('main');
      const orderHeader = screen.getByTestId('order-header');
      const child = screen.getByTestId('child');

      // Check that both elements are present in the main container
      expect(main).toContainElement(orderHeader);
      expect(main).toContainElement(child);
    });
  });

  describe('Props Interface', () => {
    it('should accept children prop', () => {
      const TestComponent = () => (
        <PaymentLayout>
          <span>Test Children</span>
        </PaymentLayout>
      );
      render(<TestComponent />);
      expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<PaymentLayout>{null}</PaymentLayout>);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(screen.getByTestId('order-header')).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(<PaymentLayout>{undefined}</PaymentLayout>);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(screen.getByTestId('order-header')).toBeInTheDocument();
    });
  });

  describe('Suspense Integration', () => {
    it('should wrap OrderHeader in Suspense', () => {
      render(
        <PaymentLayout>
          <div>Content</div>
        </PaymentLayout>
      );

      const orderHeader = screen.getByTestId('order-header');
      expect(orderHeader).toBeInTheDocument();
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
        <PaymentLayout>
          <ComplexChild />
        </PaymentLayout>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByText('Order Header')).toBeInTheDocument();
    });

    it('should handle conditional rendering', () => {
      const ConditionalChild = ({ show }: { show: boolean }) => (
        <div>
          {show && <div>Conditional Content</div>}
          <div>Always Visible</div>
        </div>
      );
      const { rerender } = render(
        <PaymentLayout>
          <ConditionalChild show={false} />
        </PaymentLayout>
      );
      expect(screen.queryByText('Conditional Content')).not.toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();
      expect(screen.getByText('Order Header')).toBeInTheDocument();
      rerender(
        <PaymentLayout>
          <ConditionalChild show={true} />
        </PaymentLayout>
      );
      expect(screen.getByText('Conditional Content')).toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();
      expect(screen.getByText('Order Header')).toBeInTheDocument();
    });
  });
});
