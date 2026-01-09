import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import VerifyOtpForm from './verify-otp-form';

jest.mock('axios');
jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));
import { registerFormAtom, otpExpiresAtAtom, verificationChannelAtom, authAtom } from '@/store';
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ replace: mockPush });

describe('VerifyOtpForm', () => {
  const mockPhoneNumber = '+628123456789';
  const mockSetAtom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === registerFormAtom) return [{ email: 'test@mail.com', phoneNumber: mockPhoneNumber }, mockSetAtom];
      if (atom === otpExpiresAtAtom) return [Date.now() / 1000 + 60, mockSetAtom]; // 60 seconds from now
      if (atom === verificationChannelAtom) return ['phoneNumber', mockSetAtom];
      if (atom === authAtom) return [{ isLoggedIn: false, userData: null, loading: false }, mockSetAtom];
      return [{ isLoggedIn: false, userData: null, loading: false }, mockSetAtom];
    });
  });

  it('renders phone number and timer', () => {
    render(<VerifyOtpForm />);
    expect(
      screen.getByText(
        `We've sent Wu an OTP code to your phone number **********789`
      )
    ).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('auto focuses first input on mount', async () => {
    render(<VerifyOtpForm />);
    const firstInput = screen.getByLabelText('OTP digit 1');
    await waitFor(() => expect(firstInput).toHaveFocus());
  });

  it('allows typing digits into OTP fields', () => {
    render(<VerifyOtpForm />);
    const inputs = Array.from({ length: 6 }, (_, i) =>
      screen.getByLabelText(`OTP digit ${i + 1}`)
    );
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0]).toHaveValue('1');
  });

  it('triggers resend OTP api', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

    // Override mock to show resend button (expired timer)
    (useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === otpExpiresAtAtom) return [Date.now() / 1000 - 10, mockSetAtom]; // expired
      if (atom === registerFormAtom) return [{ email: 'test@mail.com', phoneNumber: mockPhoneNumber }, mockSetAtom];
      if (atom === verificationChannelAtom) return ['phoneNumber', mockSetAtom];
      if (atom === authAtom) return [{ isLoggedIn: false, userData: null, loading: false }, mockSetAtom];
      return [{ isLoggedIn: false, userData: null, loading: false }, mockSetAtom];
    });

    render(<VerifyOtpForm />);

    const resendButton = screen.getByText('Resend OTP');
    fireEvent.click(resendButton);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('/api/auth/request-otp', {
        phoneNumber: mockPhoneNumber,
      })
    );
  });

  it('submits OTP when all fields are filled', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

    render(<VerifyOtpForm />);

    const inputs = Array.from({ length: 6 }, (_, i) =>
      screen.getByLabelText(`OTP digit ${i + 1}`)
    );
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: `${i + 1}` } });
    });

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('/api/auth/verify-otp', {
        phoneNumber: mockPhoneNumber,
        code: '123456',
      })
    );

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
        email: 'test@mail.com',
        phoneNumber: mockPhoneNumber,
      })
    );

    expect(screen.getByRole('button', { name: /get in/i })).toBeInTheDocument();
  });

  it('shows error when OTP verification fails', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Failed'));

    render(<VerifyOtpForm />);
    const inputs = Array.from({ length: 6 }, (_, i) =>
      screen.getByLabelText(`OTP digit ${i + 1}`)
    );
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: `${i + 1}` } });
    });

    await waitFor(() =>
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
    );
  });


});
