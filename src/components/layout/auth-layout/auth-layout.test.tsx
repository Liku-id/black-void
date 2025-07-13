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
  // Test gambar dihapus karena asset sudah tidak ada

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
