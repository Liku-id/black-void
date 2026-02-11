import { render, screen } from '@testing-library/react';
import PrivacyPolicyPage from './page';

// Mock component
jest.mock('@/components/legal/privacy-policy', () => () => <div data-testid="privacy-policy">PrivacyPolicy</div>);

describe('PrivacyPolicyPage', () => {
  it('renders correctly', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByTestId('privacy-policy')).toBeInTheDocument();
  });
});
