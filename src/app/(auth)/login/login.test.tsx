import { render, screen } from '@testing-library/react';
import LoginPage from './page';

jest.mock('@/components/auth/login/form', () => () => (
  <div data-testid="login-form">Mocked LoginForm</div>
));

jest.mock('@/components', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

describe('LoginPage', () => {
  it('renders the welcome message and heading', () => {
    render(<LoginPage />);

    expect(screen.getByText('It takes a little more to find the chosen Wu!')).toBeInTheDocument();
  });

  it('renders the mocked LoginForm', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders the forgot password and signup links', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Forgot Your Password\?/i)).toHaveAttribute(
      'href',
      '/forgot-password'
    );
    expect(screen.getByText(/Sign up/i)).toHaveAttribute('href', '/register');
  });
});
