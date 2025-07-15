import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './index';

// Mock ReactDOM.createPortal to just render children
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: any) => node,
}));

describe('Modal', () => {
  it('does not render when open is false', () => {
    render(
      <Modal open={false} onClose={jest.fn()} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders title, children, and footer when open', () => {
    render(
      <Modal
        open={true}
        onClose={jest.fn()}
        title="Test Title"
        footer={<div>Footer</div>}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );
    const closeBtn = screen.getByRole('img', { name: /close/i }).parentElement;
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });
});
