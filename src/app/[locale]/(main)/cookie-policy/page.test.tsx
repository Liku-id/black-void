import { render, screen } from '@testing-library/react';
import CookiePolicyPage from './page';

// Mock component
jest.mock('@/components/legal/cookie-policy', () => () => <div data-testid="cookie-policy">CookiePolicy</div>);

describe('CookiePolicyPage', () => {
  it('renders correctly', () => {
    render(<CookiePolicyPage />);
    expect(screen.getByTestId('cookie-policy')).toBeInTheDocument();
  });
});
