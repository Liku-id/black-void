import { render, screen } from '@testing-library/react';
import MyTicketPage from './page';

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="my-ticket-component">MyTicket</div>;
  DynamicComponent.displayName = 'LoadableComponent';
  return DynamicComponent;
});

describe('MyTicketPage', () => {
  it('renders correctly', () => {
    render(<MyTicketPage />);

    // Check header
    expect(screen.getByText(/YOUR TICKET/i)).toBeInTheDocument();

    // Check component
    expect(screen.getByTestId('my-ticket-component')).toBeInTheDocument();
  });
});
