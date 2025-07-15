import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SentModal from './sent-modal';

// Mock Modal portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: any) => node,
}));

// Mock components if needed (e.g., next/image)
jest.mock('next/image', () => (props: any) => <img {...props} />);

describe('SentModal', () => {
  const onClose = jest.fn();
  const onResend = jest.fn();
  const sentEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when open is false', () => {
    render(
      <SentModal
        open={false}
        onClose={onClose}
        sentEmail={sentEmail}
        onResend={onResend}
      />
    );
    expect(screen.queryByText(/email is sent!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(sentEmail)).not.toBeInTheDocument();
  });

  it('renders modal with correct content when open', () => {
    render(
      <SentModal
        open={true}
        onClose={onClose}
        sentEmail={sentEmail}
        onResend={onResend}
      />
    );
    expect(screen.getByText(/email is sent!/i)).toBeInTheDocument();
    expect(screen.getByText(sentEmail)).toBeInTheDocument();
    expect(
      screen.getByText(
        /please check your inbox for reset password instruction/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/didn’t get the message/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /resend link/i })
    ).toBeInTheDocument();
  });

  it('calls onResend when Resend Link button is clicked', () => {
    render(
      <SentModal
        open={true}
        onClose={onClose}
        sentEmail={sentEmail}
        onResend={onResend}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /resend link/i }));
    expect(onResend).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <SentModal
        open={true}
        onClose={onClose}
        sentEmail={sentEmail}
        onResend={onResend}
      />
    );
    // Find close button by role or alt text
    const closeBtn = screen.getByRole('img', { name: /close/i }).parentElement;
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });
});
