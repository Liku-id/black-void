import { render, screen } from '@testing-library/react';
import InvitationTicketPage from './page';

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = (props: any) => <div data-testid="ticket-component" data-type={props.type}>Ticket</div>;
  DynamicComponent.displayName = 'LoadableComponent';
  return DynamicComponent;
});

describe('InvitationTicketPage', () => {
  it('renders correctly with type="invitation"', () => {
    render(<InvitationTicketPage />);
    const ticketElement = screen.getByTestId('ticket-component');
    expect(ticketElement).toBeInTheDocument();
    expect(ticketElement).toHaveAttribute('data-type', 'invitation');
  });
});
