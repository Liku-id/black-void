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
    // Use a custom function to match text split across multiple elements
    expect(screen.getByText((content, element) => {
      const hasText = (node: Element) => node.textContent === "let's get wu verified" || node.textContent === "LET'S GET WU VERIFIED";
      const nodeHasText = hasText(element!);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        child => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText || content.toLowerCase().includes("let's get wu verified");
    })).toBeInTheDocument();
  });

  it('renders the mocked VerifyOtpForm', () => {
    render(<VerifyOtpPage />);
    expect(screen.getByTestId('verify-otp-form')).toBeInTheDocument();
  });
});
