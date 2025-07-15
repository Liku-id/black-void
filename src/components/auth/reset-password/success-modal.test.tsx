import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from './success-modal';

jest.mock('next/image', () => (props: any) => <img {...props} />);

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('SuccessModal', () => {
  it('renders modal with title and content when open', () => {
    render(<SuccessModal open={true} onClose={jest.fn()} />);
    expect(screen.getByText(/reset password complete/i)).toBeInTheDocument();
    expect(screen.getByText(/your password has been succesfully reset/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<SuccessModal open={false} onClose={jest.fn()} />);
    expect(screen.queryByText(/reset password complete/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<SuccessModal open={true} onClose={onClose} />);
    // Find close button by role or alt text
    const closeBtn = screen.getByRole('img', { name: /close/i }).parentElement;
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });

  it('redirects to /login when login button is clicked', () => {
    render(<SuccessModal open={true} onClose={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
}); 