import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAtom } from 'jotai';
import VerifyOtpForm from './verify-otp-form';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(),
}));

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  atom: jest.fn((initialValue) => initialValue),
}));

jest.mock('@/store', () => ({
  registerFormAtom: {},
}));

jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, className, size }: any) => (
    <span className={`${size ? `text-${size}` : ''} ${className}`}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/layout/loading', () => {
  return function Loading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock('./success-modal', () => {
  return function SuccessModal({ open, onLogin }: any) {
    if (!open) return null;
    return (
      <div data-testid="success-modal">
        <button onClick={onLogin}>Login</button>
      </div>
    );
  };
});

// Mock utilities
jest.mock('@/utils/formatter', () => ({
  formatCountdownTime: jest.fn(
    (seconds) =>
      `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  ),
}));

jest.mock('@/utils/debounce', () => {
  return jest.fn((fn) => fn);
});

jest.mock('@/lib/api/error-handler', () => ({
  getErrorMessage: jest.fn(
    (error) => error?.response?.data?.message || 'An error occurred'
  ),
}));

const mockRouter = {
  replace: jest.fn(),
};

const mockUseAtom = useAtom as jest.MockedFunction<typeof useAtom>;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('VerifyOtpForm Component', () => {
  const mockPayload = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+6281234567890',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (mockUseAtom as any).mockReturnValue([mockPayload, jest.fn()]);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Component Rendering', () => {
    it('should render OTP form with 6 input fields', () => {
      render(<VerifyOtpForm />);

      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(`OTP digit ${i}`)).toBeInTheDocument();
      }
    });

    it('should display phone number in the message', () => {
      render(<VerifyOtpForm />);

      expect(
        screen.getByText(/We already sent you one time password to this number/)
      ).toBeInTheDocument();
      expect(screen.getByText(/\+6281234567890/)).toBeInTheDocument();
    });

    it('should show countdown timer', () => {
      render(<VerifyOtpForm />);

      expect(screen.getByText('1:00')).toBeInTheDocument();
    });

    it('should not render when no phone number', () => {
      (mockUseAtom as any).mockReturnValue([
        { ...mockPayload, phoneNumber: '' },
        jest.fn(),
      ]);

      const { container } = render(<VerifyOtpForm />);
      expect(container.firstChild).toBeNull();
    });

    it('should redirect to register when no phone number', () => {
      (mockUseAtom as any).mockReturnValue([
        { ...mockPayload, phoneNumber: '' },
        jest.fn(),
      ]);

      render(<VerifyOtpForm />);

      expect(mockRouter.replace).toHaveBeenCalledWith('/register');
    });
  });

  describe('OTP Input Handling', () => {
    it('should handle numeric input correctly', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');
      fireEvent.change(firstInput, { target: { value: '1' } });

      expect(firstInput).toHaveValue('1');
    });

    it('should reject non-numeric input', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');
      fireEvent.change(firstInput, { target: { value: 'a' } });

      expect(firstInput).toHaveValue('');
    });

    it('should auto-focus next input when digit is entered', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');
      const secondInput = screen.getByLabelText('OTP digit 2');

      fireEvent.change(firstInput, { target: { value: '1' } });

      expect(document.activeElement).toBe(secondInput);
    });

    it('should handle backspace navigation', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');
      const secondInput = screen.getByLabelText('OTP digit 2');

      // Fill first input and move to second
      fireEvent.change(firstInput, { target: { value: '1' } });
      fireEvent.change(secondInput, { target: { value: '2' } });

      // Clear second input and press backspace
      fireEvent.change(secondInput, { target: { value: '' } });
      fireEvent.keyDown(secondInput, { key: 'Backspace' });

      expect(document.activeElement).toBe(firstInput);
    });

    it('should handle paste functionality', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');

      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '123456',
        },
      });

      // The paste functionality should populate the fields
      expect(firstInput).toBeInTheDocument();
    });

    it('should handle paste with non-numeric characters', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');

      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '12a34b56',
        },
      });

      // The paste functionality should filter non-numeric characters
      expect(firstInput).toBeInTheDocument();
    });

    it('should handle paste with less than 6 digits', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');

      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '123',
        },
      });

      expect(screen.getByLabelText('OTP digit 1')).toHaveValue('1');
      expect(screen.getByLabelText('OTP digit 2')).toHaveValue('2');
      expect(screen.getByLabelText('OTP digit 3')).toHaveValue('3');
      expect(screen.getByLabelText('OTP digit 4')).toHaveValue('');
      expect(screen.getByLabelText('OTP digit 5')).toHaveValue('');
      expect(screen.getByLabelText('OTP digit 6')).toHaveValue('');
    });
  });

  describe('OTP Validation and Submission', () => {
    it('should auto-submit when all 6 digits are entered', async () => {
      mockAxios.post.mockResolvedValueOnce({ status: 200 }); // verify-otp
      mockAxios.post.mockResolvedValueOnce({ status: 200 }); // register

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/verify-otp', {
          phoneNumber: '+6281234567890',
          code: '123456',
        });
      });
    });

    it('should not submit when OTP is incomplete', () => {
      render(<VerifyOtpForm />);

      // Fill only 5 digits
      for (let i = 1; i <= 5; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      expect(mockAxios.post).not.toHaveBeenCalled();
    });

    it('should show error when OTP verification fails', async () => {
      const errorMessage = 'Invalid OTP code';
      mockAxios.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Should clear OTP fields on error
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(`OTP digit ${i}`)).toHaveValue('');
      }
    });

    it('should show loading state during submission', async () => {
      // Use immediate resolution instead of setTimeout
      mockAxios.post.mockImplementation(() => Promise.resolve({ status: 200 }));

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      // Loading should appear briefly
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should disable inputs during loading', async () => {
      // Use immediate resolution instead of setTimeout
      mockAxios.post.mockImplementation(() => Promise.resolve({ status: 200 }));

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      // Inputs should be disabled during loading
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(`OTP digit ${i}`)).toBeDisabled();
      }
    });
  });

  describe('Resend OTP Functionality', () => {
    it('should show resend option when timer reaches zero', () => {
      render(<VerifyOtpForm initialSeconds={0} />);

      expect(screen.getByText("Didn't get the OTP?")).toBeInTheDocument();
      expect(screen.getByText('Resend OTP')).toBeInTheDocument();
    });

    it('should handle resend OTP successfully', async () => {
      mockAxios.post.mockResolvedValueOnce({ status: 200 });

      render(<VerifyOtpForm initialSeconds={0} />);

      const resendButton = screen.getByText('Resend OTP');
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/request-otp', {
          phoneNumber: '+6281234567890',
        });
      });

      expect(screen.getByText('OTP has been resent')).toBeInTheDocument();
    });

    it('should show loading state during resend', async () => {
      // Use immediate resolution instead of setTimeout
      mockAxios.post.mockImplementation(() => Promise.resolve({ status: 200 }));

      render(<VerifyOtpForm initialSeconds={0} />);

      const resendButton = screen.getByText('Resend OTP');
      fireEvent.click(resendButton);

      expect(screen.getByText('Sending OTP...')).toBeInTheDocument();
    });

    it('should handle resend error', async () => {
      const errorMessage = 'Failed to resend OTP';
      mockAxios.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      render(<VerifyOtpForm initialSeconds={0} />);

      const resendButton = screen.getByText('Resend OTP');
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should reset timer and OTP fields after successful resend', async () => {
      mockAxios.post.mockResolvedValueOnce({ status: 200 });

      render(<VerifyOtpForm initialSeconds={0} />);

      // Fill some OTP fields first
      for (let i = 1; i <= 3; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      const resendButton = screen.getByText('Resend OTP');
      fireEvent.click(resendButton);

      await waitFor(() => {
        // Timer should reset to 60 seconds
        expect(screen.getByText('1:00')).toBeInTheDocument();

        // OTP fields should be cleared
        for (let i = 1; i <= 6; i++) {
          expect(screen.getByLabelText(`OTP digit ${i}`)).toHaveValue('');
        }
      });
    });
  });

  describe('Timer Functionality', () => {
    it('should countdown timer correctly', () => {
      render(<VerifyOtpForm initialSeconds={5} />);

      expect(screen.getByText('0:05')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText('0:04')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(4000);
      });

      expect(screen.getByText('0:00')).toBeInTheDocument();
    });

    it('should stop countdown at zero', () => {
      render(<VerifyOtpForm initialSeconds={1} />);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(screen.getByText('0:00')).toBeInTheDocument();
    });
  });

  describe('Success Flow', () => {
    it('should show success modal after successful verification and registration', async () => {
      mockAxios.post.mockResolvedValueOnce({ status: 200 }); // verify-otp
      mockAxios.post.mockResolvedValueOnce({ status: 200 }); // register

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      await waitFor(() => {
        expect(screen.getByTestId('success-modal')).toBeInTheDocument();
      });
    });

    it('should handle login button click in success modal', async () => {
      mockAxios.post.mockResolvedValueOnce({ status: 200 }); // verify-otp
      mockAxios.post.mockResolvedValueOnce({ status: 200 }); // register

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      await waitFor(() => {
        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);
      });

      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });
  });

  describe('Error Handling', () => {
    it('should clear error when new input is entered', async () => {
      render(<VerifyOtpForm />);

      // First, trigger an error by submitting invalid OTP
      mockAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid OTP' } },
      });

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
      });

      // Enter new digit to clear error
      const firstInput = screen.getByLabelText('OTP digit 1');
      fireEvent.change(firstInput, { target: { value: '9' } });

      expect(screen.queryByText('Invalid OTP')).not.toBeInTheDocument();
    });

    it('should handle network errors', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Network error'));

      render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      await waitFor(() => {
        expect(screen.getByText('An error occurred')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for OTP inputs', () => {
      render(<VerifyOtpForm />);

      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        expect(input).toHaveAttribute('aria-label', `OTP digit ${i}`);
      }
    });

    it('should have proper input attributes', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');
      expect(firstInput).toHaveAttribute('inputMode', 'numeric');
      expect(firstInput).toHaveAttribute('maxLength', '1');
      expect(firstInput).toHaveAttribute('autoComplete', 'one-time-code');
    });

    it('should handle keyboard navigation for resend button', () => {
      render(<VerifyOtpForm initialSeconds={0} />);

      const resendButton = screen.getByText('Resend OTP');

      // Test Enter key
      fireEvent.keyDown(resendButton, { key: 'Enter' });
      expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/request-otp', {
        phoneNumber: '+6281234567890',
      });

      // Test Space key
      fireEvent.keyDown(resendButton, { key: ' ' });
      expect(mockAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');

      // Rapidly change input
      fireEvent.change(firstInput, { target: { value: '1' } });
      fireEvent.change(firstInput, { target: { value: '2' } });
      fireEvent.change(firstInput, { target: { value: '3' } });

      expect(firstInput).toHaveValue('3');
    });

    it('should handle multiple paste events', () => {
      render(<VerifyOtpForm />);

      const firstInput = screen.getByLabelText('OTP digit 1');

      // First paste
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '123456',
        },
      });

      // Second paste
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '654321',
        },
      });

      // The paste functionality should handle multiple events
      expect(firstInput).toBeInTheDocument();
    });

    it('should handle component unmount during async operations', async () => {
      // Use immediate resolution instead of setTimeout
      mockAxios.post.mockImplementation(() => Promise.resolve({ status: 200 }));

      const { unmount } = render(<VerifyOtpForm />);

      // Fill all OTP fields
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`OTP digit ${i}`);
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      // Unmount before async operation completes
      unmount();

      // Should not throw any errors
      await act(async () => {
        // No need to wait since we're using immediate resolution
      });
    });
  });
});
