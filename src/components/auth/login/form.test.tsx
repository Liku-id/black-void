import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

jest.mock('@/lib/api/error-handler', () => ({
  getErrorMessage: jest.fn(() => 'invalid credentials'),
}));

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields and login button', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('submits form and redirects on success', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    render(<LoginForm />);

    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@mail.com',
        password: 'secret123',
      });

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when login fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginForm />);

    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'fail@mail.com' },
    });

    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
