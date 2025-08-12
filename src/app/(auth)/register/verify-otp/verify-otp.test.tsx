import { render, screen } from '@testing-library/react';
import VerifyOtpPage from './page';

jest.mock('@/components/auth/verify-otp/verify-otp-form', () => () => (
  <div data-testid="verify-otp-form">Mocked VerifyOtpForm</div>
));

jest.mock('@/components', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

describe('VerifyOtpPage', () => {
  it('renders the heading text correctly', () => {
    render(<VerifyOtpPage />);
    expect(screen.getByText(/p/i)).toBeInTheDocument();
  });

  it('renders the mocked VerifyOtpForm', () => {
    render(<VerifyOtpPage />);
    expect(screen.getByTestId('verify-otp-form')).toBeInTheDocument();
  });
});
