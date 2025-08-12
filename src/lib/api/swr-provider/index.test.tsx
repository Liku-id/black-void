import React from 'react';
import { render, screen } from '@testing-library/react';
import SWRProvider from './index';

// Mock SWR
jest.mock('swr', () => ({
  SWRConfig: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: any;
  }) => (
    <div
      data-testid="swr-config"
      data-fetcher={value?.fetcher ? 'configured' : 'not-configured'}
    >
      {children}
    </div>
  ),
}));

describe('SWR Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render children correctly', () => {
      const testMessage = 'Test Child Component';
      render(
        <SWRProvider>
          <div>{testMessage}</div>
        </SWRProvider>
      );

      expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <SWRProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </SWRProvider>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      const NestedComponent = () => <div>Nested Content</div>;

      render(
        <SWRProvider>
          <div>
            <NestedComponent />
          </div>
        </SWRProvider>
      );

      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('SWR Configuration', () => {
    it('should configure SWR with fetcher', () => {
      render(
        <SWRProvider>
          <div>Test</div>
        </SWRProvider>
      );

      const swrConfig = screen.getByTestId('swr-config');
      expect(swrConfig).toHaveAttribute('data-fetcher', 'configured');
    });

    it('should pass SWRConfig with correct value prop', () => {
      render(
        <SWRProvider>
          <div>Test</div>
        </SWRProvider>
      );

      const swrConfig = screen.getByTestId('swr-config');
      expect(swrConfig).toBeInTheDocument();
    });
  });

  describe('Props Interface', () => {
    it('should accept children prop', () => {
      const TestComponent = () => (
        <SWRProvider>
          <span>Test Children</span>
        </SWRProvider>
      );

      render(<TestComponent />);
      expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<SWRProvider>{null}</SWRProvider>);

      const swrConfig = screen.getByTestId('swr-config');
      expect(swrConfig).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(<SWRProvider>{undefined}</SWRProvider>);

      const swrConfig = screen.getByTestId('swr-config');
      expect(swrConfig).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render SWRConfig wrapper', () => {
      render(
        <SWRProvider>
          <div>Content</div>
        </SWRProvider>
      );

      expect(screen.getByTestId('swr-config')).toBeInTheDocument();
    });

    it('should maintain component hierarchy', () => {
      const { container } = render(
        <SWRProvider>
          <div data-testid="child">Child Content</div>
        </SWRProvider>
      );

      const swrConfig = screen.getByTestId('swr-config');
      const child = screen.getByTestId('child');

      expect(swrConfig).toContainElement(child);
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
        <SWRProvider>
          <ComplexChild />
        </SWRProvider>
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
        <SWRProvider>
          <ConditionalChild show={false} />
        </SWRProvider>
      );

      expect(screen.queryByText('Conditional Content')).not.toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();

      rerender(
        <SWRProvider>
          <ConditionalChild show={true} />
        </SWRProvider>
      );

      expect(screen.getByText('Conditional Content')).toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();
    });
  });
});
