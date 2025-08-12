import { render, screen } from '@testing-library/react';
import CookiePolicyPage from './page';

// Mock the CookiePolicy component
jest.mock('@/components/legal/cookie-policy', () => ({
  __esModule: true,
  default: () => <div data-testid="cookie-policy">Cookie Policy Content</div>,
}));

describe('CookiePolicyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render CookiePolicy component', () => {
      render(<CookiePolicyPage />);

      expect(screen.getByTestId('cookie-policy')).toBeInTheDocument();
      expect(screen.getByText('Cookie Policy Content')).toBeInTheDocument();
    });

    it('should render the component without crashing', () => {
      expect(() => render(<CookiePolicyPage />)).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should render the CookiePolicy component as the main content', () => {
      render(<CookiePolicyPage />);

      const cookiePolicy = screen.getByTestId('cookie-policy');
      expect(cookiePolicy).toBeInTheDocument();
    });

    it('should have the correct component structure', () => {
      const { container } = render(<CookiePolicyPage />);

      // Should render a single div containing the CookiePolicy component
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with the mocked CookiePolicy component', () => {
      render(<CookiePolicyPage />);

      const cookiePolicy = screen.getByTestId('cookie-policy');
      expect(cookiePolicy).toHaveTextContent('Cookie Policy Content');
    });
  });
});
