import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from './success-modal';
import '@testing-library/jest-dom';

describe('SuccessModal', () => {
  const mockOnClose = jest.fn();
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when open is true', () => {
    render(
      <SuccessModal open={true} onClose={mockOnClose} onLogin={mockOnLogin} />
    );

    expect(screen.getByText('Registration successful')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Congratulation, your account has been successfully created.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    const { queryByText } = render(
      <SuccessModal open={false} onClose={mockOnClose} onLogin={mockOnLogin} />
    );

    expect(queryByText('Registration successful')).not.toBeInTheDocument();
  });

  it('should call onLogin when Login button is clicked', () => {
    render(
      <SuccessModal open={true} onClose={mockOnClose} onLogin={mockOnLogin} />
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockOnLogin).toHaveBeenCalled();
  });
});
