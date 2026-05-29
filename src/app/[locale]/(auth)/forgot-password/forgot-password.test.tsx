import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './page';

describe('ForgotPasswordPage', () => {
  it('renders the heading', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/trouble logging in\?/i)).toBeInTheDocument();
  });

  it('renders the instruction text', () => {
    render(<ForgotPasswordPage />);
    expect(
      screen.getByText(
        /enter your registered email below to receive password reset instructions/i
      )
    ).toBeInTheDocument();
  });

  it('renders the forgot password form', () => {
    render(<ForgotPasswordPage />);
    // Check for email input or submit button (adjust selector as needed)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the back to login link', () => {
    render(<ForgotPasswordPage />);
    const link = screen.getByRole('link', { name: /back to login/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});
