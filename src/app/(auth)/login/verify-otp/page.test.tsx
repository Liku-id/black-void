import { render, screen } from '@testing-library/react';
import LoginVerifyOtpPage from './page';

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="verify-otp-form">VerifyOtpForm</div>;
  DynamicComponent.displayName = 'LoadableComponent';
  return DynamicComponent;
});

describe('LoginVerifyOtpPage', () => {
  it('renders correctly', () => {
    render(<LoginVerifyOtpPage />);

    // Check for main heading
    // Check for main heading using getAllByText to handle potential duplicates or split text issues
    const headings = screen.getAllByText((content, node) => {
      const hasText = (node: Element) => node.textContent === "phone number verification";
      const nodeHasText = hasText(node);
      return nodeHasText || node.textContent?.toLowerCase() === "phone number verification";
    });
    expect(headings[0]).toBeInTheDocument();

    // Check if form is rendered (mocked)
    expect(screen.getByTestId('verify-otp-form')).toBeInTheDocument();
  });
});
