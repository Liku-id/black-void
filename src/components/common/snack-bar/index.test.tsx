import { render, screen, act } from '@testing-library/react';
import SnackBar from './index';

jest.useFakeTimers();

describe('SnackBar', () => {
  it('renders when show is true', () => {
    render(<SnackBar show={true} text="Hello World" />);

    // Trigger animations
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(<SnackBar show={false} text="Hidden" />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('auto hides after delay', () => {
    const onHide = jest.fn();
    render(<SnackBar show={true} text="Auto Hide" onHide={onHide} autoHideDelay={1000} />);

    act(() => {
      jest.advanceTimersByTime(1000);
      // Wait for exit animation
      jest.advanceTimersByTime(500);
    });

    expect(onHide).toHaveBeenCalled();
  });
});
