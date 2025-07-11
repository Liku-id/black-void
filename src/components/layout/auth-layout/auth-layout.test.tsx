import { render, screen } from '@testing-library/react';
import AuthLayout from './index';

jest.mock('@/components/layout/stripe-text', () => ({
  __esModule: true,
  default: ({ direction, className }: any) => (
    <div
      data-testid="stripe-text"
      data-direction={direction}
      className={className}
    />
  ),
}));

describe('AuthLayout', () => {
  it('renders background and logo images', () => {
    render(<AuthLayout />);

    const backgroundImg = screen.getByAltText(
      /Event Ticketing Platform Login and Registration Background/i
    );
    const logoImg = screen.getByAltText(/Logo/i);

    expect(backgroundImg).toBeInTheDocument();
    expect(logoImg).toBeInTheDocument();
  });

  it('renders stripe vertical text component', () => {
    render(<AuthLayout />);
    const stripe = screen.getByTestId('stripe-text');

    expect(stripe).toBeInTheDocument();
    expect(stripe).toHaveAttribute('data-direction', 'vertical');
  });

  it('renders children correctly', () => {
    render(
      <AuthLayout>
        <div data-testid="child-content">Login form</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Login form')).toBeInTheDocument();
  });
});
