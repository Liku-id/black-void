import { render, screen } from '@testing-library/react';
import AuthSegmentLayout, { metadata } from './layout';

jest.mock('@/components/layout/auth-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
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

  it('contains correct metadata information', () => {
    expect(metadata.title).toBe(
      'Login | Wukong - Buy Concert Tickets, Events, and Entertainment'
    );
    expect(metadata.description).toMatch(/Log in to your Wukong account/i);
    expect(metadata.keywords).toContain('login');
  });
});
