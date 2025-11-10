import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SuccessModal from './success-modal';

describe('SuccessModal', () => {
  const mockOnContinue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when open is true', () => {
    render(<SuccessModal open={true} onContinue={mockOnContinue} />);

    expect(screen.getByText('Wu-hoo!')).toBeInTheDocument();
    expect(
      screen.getByText('you are now The Chosen Wu!')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /get in/i })
    ).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    const { queryByText } = render(
      <SuccessModal open={false} onContinue={mockOnContinue} />
    );

    expect(queryByText('Wu-hoo!')).not.toBeInTheDocument();
  });

  it('should call onContinue when Get In button is clicked', () => {
    render(<SuccessModal open={true} onContinue={mockOnContinue} />);

    fireEvent.click(screen.getByRole('button', { name: /get in/i }));
    expect(mockOnContinue).toHaveBeenCalled();
  });
});
