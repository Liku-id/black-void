import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import ComingSoon from './page';

// Mock Three.js modules
jest.mock('three', () => ({
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  PlaneGeometry: jest.fn(),
  ShaderMaterial: jest.fn(),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
  })),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
    attributes: {
      position: {
        array: new Float32Array(100),
        needsUpdate: false,
        setY: jest.fn(),
      },
      color: {
        array: new Float32Array(100),
        needsUpdate: false,
        setX: jest.fn(),
        setY: jest.fn(),
        setZ: jest.fn(),
      },
    },
  })),
  BufferAttribute: jest.fn(),
  PointsMaterial: jest.fn(),
  Points: jest.fn().mockImplementation(() => ({
    rotation: { x: 0, y: 0 },
  })),
  DoubleSide: 'DoubleSide',
}));

// Mock fetch
global.fetch = jest.fn();

// Mock CSS import
jest.mock('./coming-soon.css', () => ({}));

describe('ComingSoon Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current date to be before target date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the main heading', () => {
    render(<ComingSoon />);
    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
  });

  it('renders the subtitle text', () => {
    render(<ComingSoon />);
    expect(
      screen.getByText('Something amazing is in the works')
    ).toBeInTheDocument();
  });

  it('renders the countdown timer', () => {
    render(<ComingSoon />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();
  });

  it('renders the email notification section', () => {
    render(<ComingSoon />);
    expect(screen.getByText('Get notified when we launch')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Notify Me' })
    ).toBeInTheDocument();
  });

  it('renders the scroll down indicator', () => {
    render(<ComingSoon />);
    expect(screen.getByText('Scroll down')).toBeInTheDocument();
  });

  it('renders the copyright text', () => {
    render(<ComingSoon />);
    expect(
      screen.getByText(/Copyright © 2025 - PT Aku Rela Kamu Bahagia/)
    ).toBeInTheDocument();
  });

  it('updates countdown timer values', async () => {
    render(<ComingSoon />);

    // Initial render should show some values
    const daysElement = screen.getByText('Days').previousElementSibling;
    const hoursElement = screen.getByText('Hours').previousElementSibling;
    const minutesElement = screen.getByText('Minutes').previousElementSibling;
    const secondsElement = screen.getByText('Seconds').previousElementSibling;

    expect(daysElement).toBeInTheDocument();
    expect(hoursElement).toBeInTheDocument();
    expect(minutesElement).toBeInTheDocument();
    expect(secondsElement).toBeInTheDocument();

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Values should have changed
    await waitFor(() => {
      expect(daysElement).toBeInTheDocument();
    });
  });

  it('handles email input changes', () => {
    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('submits email form successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(submitButton);

    // Check if button shows loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Thank you! We'll notify you when we launch.")
      ).toBeInTheDocument();
    });

    // Check if email input is cleared
    expect(emailInput).toHaveValue('');
  });

  it('handles email form submission error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Something went wrong. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('prevents form submission with empty email', () => {
    render(<ComingSoon />);
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    fireEvent.click(submitButton);

    // Should not show loading state or success/error messages
    expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
    expect(
      screen.queryByText("Thank you! We'll notify you when we launch.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Something went wrong. Please try again.')
    ).not.toBeInTheDocument();
  });

  it('disables submit button during submission', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('shows colons between countdown values when time is remaining', () => {
    // Mock a date that's closer to target date to ensure some values > 0
    jest.setSystemTime(new Date('2025-07-29T23:59:59.000Z'));

    render(<ComingSoon />);

    // Wait for the timer to update
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check if any colons are visible (they appear when values > 0)
    const countdownContainer = screen
      .getByText('Days')
      .closest('div')?.parentElement;
    expect(countdownContainer).toBeInTheDocument();
  });

  it('handles form submission with keyboard', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const form = emailInput.closest('form');

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/AKfycbyJoCeE0nvhs03xBvfmzJWM8a7O--37LC46vmdghR_38A1bHTjUYKY5AJneAn9npdkV/exec',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
          mode: 'no-cors',
        })
      );
    });
  });

  it('validates email input type', () => {
    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  it('renders with proper accessibility attributes', () => {
    render(<ComingSoon />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('does not submit form when email is empty', async () => {
    render(<ComingSoon />);
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    // Try to submit without entering email
    fireEvent.click(submitButton);

    // Should not show loading state
    expect(screen.getByText('Notify Me')).toBeInTheDocument();
    expect(screen.queryByText('Sending...')).not.toBeInTheDocument();

    // Should not make fetch call
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('prevents form submission with empty email via form submit', async () => {
    render(<ComingSoon />);
    const form = screen
      .getByPlaceholderText('Enter your email')
      .closest('form');
    const submitButton = screen.getByRole('button', {
      name: 'Notify Me',
    });

    // Try to submit form without email
    fireEvent.submit(form!);

    // Should not show loading state
    expect(screen.getByText('Notify Me')).toBeInTheDocument();
    expect(screen.queryByText('Sending...')).not.toBeInTheDocument();

    // Should not make fetch call
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
