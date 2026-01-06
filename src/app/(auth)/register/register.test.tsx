import { render, screen } from '@testing-library/react';
import RegisterPage from './page';

jest.mock('@/components/auth/register/register-form', () => () => (
  <div data-testid="register-form">Mocked RegisterForm</div>
));

jest.mock('@/components', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

describe('RegisterPage', () => {
  it('renders the heading text correctly', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Lets get Wu in!/i)).toBeInTheDocument();
    // ('enter your personal data');
  });

  it('renders the mocked RegisterForm', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('renders the forgot password and login links', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Forgot Your Password\?/i)).toHaveAttribute(
      'href',
      '/forgot-password'
    );
    expect(screen.getByText(/Log In/i)).toHaveAttribute('href', '/login');
  });
});
