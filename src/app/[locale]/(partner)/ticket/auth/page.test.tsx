import { render, screen } from '@testing-library/react';
import TicketAuthPage from './page';

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="login-form">LoginForm</div>;
  DynamicComponent.displayName = 'LoadableComponent';
  return DynamicComponent;
});

jest.mock('@/components/scanner/safari-warning-modal', () => ({ open }: any) =>
  open ? <div data-testid="safari-warning">Safari Warning</div> : null
);

describe('TicketAuthPage', () => {
  it('renders correctly', () => {
    render(<TicketAuthPage />);

    // Check for greeting
    expect(screen.getByText(/Hi partner/i)).toBeInTheDocument();

    // Check for split heading "Ready to Scan?"
    const headings = screen.getAllByText((content, node) => {
      return node.textContent === "Ready to Scan?" || node.textContent?.toLowerCase() === "ready to scan?";
    });
    expect(headings.length).toBeGreaterThan(0);

    // Check login form
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
