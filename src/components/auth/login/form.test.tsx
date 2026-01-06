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
  usePathname: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation(() => { });

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockReplace = jest.fn();
export const mockUsePathname = jest.fn();
(require('next/navigation').usePathname as jest.Mock).mockImplementation(
  mockUsePathname
);
(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields and login button', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /get in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
  });

  it('submits form and redirects on success', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@mail.com',
        },
      },
    });

    render(<LoginForm />);

    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /get in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
        origin: undefined,
        form: {
          email: 'test@mail.com',
          password: 'secret123',
        },
      });

      expect(mockReplace).toHaveBeenCalledWith('/');
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

    fireEvent.click(screen.getByRole('button', { name: /get in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility when end icon is clicked', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    // Default type is password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Klik icon (gunakan testid untuk akurat)
    const endIcon = screen.getByTestId('endAdornment');
    fireEvent.click(endIcon);

    // Type berubah jadi text
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('shows loading component when submitting form', async () => {
    mockedAxios.post.mockImplementation(() => new Promise(() => { }));

    render(<LoginForm />);
    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /get in/i }));

    expect(await screen.findByTestId('loading')).toBeInTheDocument();
  });

  it('does not redirect if response status is not 200', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 400 });

    render(<LoginForm />);
    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'wrong@mail.com' },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: 'notgood' },
    });

    fireEvent.click(screen.getByRole('button', { name: /get in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
