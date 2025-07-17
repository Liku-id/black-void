import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyOtpForm from './verify-otp-form';
import { useAtom } from 'jotai';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));
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
    (useAtom as jest.Mock).mockReturnValue([
      { phoneNumber: mockPhoneNumber },
      mockSetAtom,
    ]);
  });

  it('renders phone number and timer', () => {
    render(<VerifyOtpForm />);
    expect(
      screen.getByText(
        `We already sent you one time password to this number ${mockPhoneNumber}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('auto focuses first input on mount', () => {
    render(<VerifyOtpForm />);
    const firstInput = screen.getByLabelText('OTP digit 1');
    expect(firstInput).toHaveFocus();
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

    render(<VerifyOtpForm initialSeconds={0} />);

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
        phoneNumber: mockPhoneNumber,
      })
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
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

  it('redirects if phone number is missing', () => {
    (useAtom as jest.Mock).mockReturnValue([{ phoneNumber: '' }, mockSetAtom]);
    render(<VerifyOtpForm />);
    expect(mockPush).toHaveBeenCalledWith('/register');
  });
});
