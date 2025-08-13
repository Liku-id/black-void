import { render, screen } from '@testing-library/react';
import PrivacyPolicyPage from './page';

// Mock the PrivacyPolicy component
jest.mock('@/components/legal/privacy-policy', () => ({
  __esModule: true,
  default: () => <div data-testid="privacy-policy">Privacy Policy Content</div>,
}));

describe('PrivacyPolicyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render PrivacyPolicy component', () => {
      render(<PrivacyPolicyPage />);

      expect(screen.getByTestId('privacy-policy')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy Content')).toBeInTheDocument();
    });

    it('should render the component without crashing', () => {
      expect(() => render(<PrivacyPolicyPage />)).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should render the PrivacyPolicy component as the main content', () => {
      render(<PrivacyPolicyPage />);

      const privacyPolicy = screen.getByTestId('privacy-policy');
      expect(privacyPolicy).toBeInTheDocument();
    });

    it('should have the correct component structure', () => {
      const { container } = render(<PrivacyPolicyPage />);

      // Should render a single div containing the PrivacyPolicy component
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with the mocked PrivacyPolicy component', () => {
      render(<PrivacyPolicyPage />);

      const privacyPolicy = screen.getByTestId('privacy-policy');
      expect(privacyPolicy).toHaveTextContent('Privacy Policy Content');
    });
  });
});
