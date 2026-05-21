import { render, screen } from '@testing-library/react';
import AuthSegmentLayout, { metadata } from './layout';

jest.mock('@/components/layout/auth-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

jest.mock('@/components/layout/header/mobile', () => ({
  __esModule: true,
  default: () => (
    <header data-testid="auth-header">
      <img alt="Logo" />
      <button aria-label="Close" />
    </header>
  ),
}));

describe('AuthSegmentLayout', () => {
  it('renders children inside AuthLayout', () => {
    render(
      <AuthSegmentLayout>
        <div>Test Child</div>
      </AuthSegmentLayout>
    );

    expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders AuthHeader with logo and close button', () => {
    render(
      <AuthSegmentLayout>
        <div>Test Child</div>
      </AuthSegmentLayout>
    );
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('contains correct metadata information', () => {
    expect(metadata.title).toBe(
      'Get in | Wukong - Buy Concert Tickets, Events, and Entertainment'
    );
    expect(metadata.description).toMatch(/Get in to your Wukong account/i);
    expect(metadata.keywords).toContain('Get in');
  });
});
