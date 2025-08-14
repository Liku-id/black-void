import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import LoginForm from './form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock axios
jest.mock('@/lib/api/axios-client', () => ({
  post: jest.fn(),
}));

// Mock error handler
jest.mock('@/lib/api/error-handler', () => ({
  getErrorMessage: jest.fn(() => 'Test error message'),
}));

// Mock auth hook
jest.mock('@/lib/session/use-auth', () => ({
  useAuth: jest.fn(),
}));

// Mock browser storage
jest.mock('@/lib/browser-storage', () => ({
  getSessionStorage: jest.fn(),
  setSessionStorage: jest.fn(),
}));

// Mock components
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Button: ({ children, className, onClick, type, id, ...props }: any) => (
    <button
      className={className}
      onClick={onClick}
      type={type}
      id={id}
      {...props}
    >
      {children}
    </button>
  ),
  Typography: ({ children, size, className }: any) => (
    <span className={`text-${size} ${className}`}>{children}</span>
  ),
  TextField: ({
    id,
    name,
    type,
    placeholder,
    className,
    rules,
    endIcon,
    onEndIconClick,
  }: any) => (
    <div className={className}>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        data-testid={id}
        defaultValue=""
        onChange={(e) => {
          // Simulate form state update
          e.target.value = e.target.value;
        }}
      />
      {endIcon && (
        <button onClick={onEndIconClick} data-testid={`${id}-toggle`}>
          {endIcon}
        </button>
      )}
    </div>
  ),
}));

// Mock loading component
jest.mock('@/components/layout/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

// Mock assets
jest.mock('@/assets/icons/eye-closed.svg', () => 'eye-closed.svg');
jest.mock('@/assets/icons/eye-open.svg', () => 'eye-open.svg');

// Mock form validation
jest.mock('@/utils/form-validation', () => ({
  email: jest.fn(() => true),
}));

describe('LoginForm Component', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  const mockSetAuthUser = jest.fn();
  const mockAxios = require('@/lib/api/axios-client');
  const mockGetSessionStorage =
    require('@/lib/browser-storage').getSessionStorage;
  const mockSetSessionStorage =
    require('@/lib/browser-storage').setSessionStorage;

  beforeEach(() => {
    jest.clearAllMocks();

    (usePathname as jest.Mock).mockReturnValue('/login');
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    require('@/lib/session/use-auth').useAuth.mockReturnValue({
      setAuthUser: mockSetAuthUser,
    });

    // Default session storage values
    mockGetSessionStorage.mockImplementation((key: string) => {
      if (key === 'destination') return '';
      if (key === 'isExpiry') return '';
      return '';
    });
  });

  describe('Component Rendering', () => {
    it('should render login form', () => {
      render(<LoginForm />);

      expect(screen.getByTestId('email_field')).toBeInTheDocument();
      expect(screen.getByTestId('password_field')).toBeInTheDocument();
      expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('should render form with correct structure', () => {
      render(<LoginForm />);

      const form = screen.getByTestId('email_field').closest('form');
      expect(form).toHaveClass('flex', 'flex-col', 'items-center');
    });

    it('should render email field with correct attributes', () => {
      render(<LoginForm />);

      const emailField = screen.getByTestId('email_field');
      expect(emailField).toHaveAttribute('type', 'email');
      expect(emailField).toHaveAttribute('placeholder', 'Email Address');
    });

    it('should render password field with correct attributes', () => {
      render(<LoginForm />);

      const passwordField = screen.getByTestId('password_field');
      expect(passwordField).toHaveAttribute('type', 'password');
      expect(passwordField).toHaveAttribute('placeholder', 'Password');
    });

    it('should render login button with correct attributes', () => {
      render(<LoginForm />);

      const loginButton = screen.getByText('Log In');
      expect(loginButton).toHaveAttribute('type', 'submit');
      expect(loginButton).toHaveAttribute('id', 'login_button');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should show password toggle button', () => {
      render(<LoginForm />);

      const toggleButton = screen.getByTestId('password_field-toggle');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle password visibility when clicked', () => {
      render(<LoginForm />);

      const passwordField = screen.getByTestId('password_field');
      const toggleButton = screen.getByTestId('password_field-toggle');

      // Initially password should be hidden
      expect(passwordField).toHaveAttribute('type', 'password');

      // Click toggle button
      fireEvent.click(toggleButton);

      // Password should be visible
      expect(passwordField).toHaveAttribute('type', 'text');
    });

    it('should toggle back to password when clicked again', () => {
      render(<LoginForm />);

      const passwordField = screen.getByTestId('password_field');
      const toggleButton = screen.getByTestId('password_field-toggle');

      // Click toggle button twice
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      // Password should be hidden again
      expect(passwordField).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      render(<LoginForm />);

      // Fill form
      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'password123' } });

      // Submit form
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/login', {
          origin: '/login',
          form: expect.any(Object),
        });
      });

      expect(mockSetAuthUser).toHaveBeenCalledWith(mockResponse.data.data);
      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    it('should handle login error', async () => {
      mockAxios.post.mockRejectedValue(new Error('Login failed'));

      render(<LoginForm />);

      // Fill and submit form
      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Test error message')).toBeInTheDocument();
      });
    });

    it('should redirect to ticket scanner when on ticket auth page', async () => {
      (usePathname as jest.Mock).mockReturnValue('/ticket/auth');

      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      render(<LoginForm />);

      // Fill and submit form
      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/ticket/scanner');
      });
    });

    it('should redirect to destination when available', async () => {
      mockGetSessionStorage.mockImplementation((key: string) => {
        if (key === 'destination') return '/dashboard';
        if (key === 'isExpiry') return '';
        return '';
      });

      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      render(<LoginForm />);

      // Fill and submit form
      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
        expect(mockSetSessionStorage).toHaveBeenCalledWith('destination', '');
        expect(mockSetSessionStorage).toHaveBeenCalledWith('isExpiry', '');
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading overlay during submission', async () => {
      mockAxios.post.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<LoginForm />);

      // Fill and submit form
      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      // Should show loading
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('should hide loading after submission completes', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      render(<LoginForm />);

      // Fill and submit form
      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('Session Expiry Message', () => {
    it('should show expiry message when isExpiry is set', () => {
      mockGetSessionStorage.mockImplementation((key: string) => {
        if (key === 'destination') return '';
        if (key === 'isExpiry') return 'true';
        return '';
      });

      render(<LoginForm />);

      expect(
        screen.getByText(
          'Session has expired. Please log in again to continue.'
        )
      ).toBeInTheDocument();
    });

    it('should hide expiry message after 5 seconds', async () => {
      jest.useFakeTimers();

      mockGetSessionStorage.mockImplementation((key: string) => {
        if (key === 'destination') return '';
        if (key === 'isExpiry') return 'true';
        return '';
      });

      render(<LoginForm />);

      expect(
        screen.getByText(
          'Session has expired. Please log in again to continue.'
        )
      ).toBeInTheDocument();

      // Fast-forward 5 seconds
      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Session has expired. Please log in again to continue.'
          )
        ).not.toBeInTheDocument();
      });

      expect(mockSetSessionStorage).toHaveBeenCalledWith('isExpiry', '');

      jest.useRealTimers();
    });

    it('should not show expiry message when isExpiry is not set', () => {
      mockGetSessionStorage.mockImplementation((key: string) => {
        if (key === 'destination') return '';
        if (key === 'isExpiry') return '';
        return '';
      });

      render(<LoginForm />);

      expect(
        screen.queryByText(
          'Session has expired. Please log in again to continue.'
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should clear error when form is submitted', async () => {
      // First, trigger an error
      mockAxios.post.mockRejectedValueOnce(new Error('Login failed'));

      render(<LoginForm />);

      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Test error message')).toBeInTheDocument();
      });

      // Then, submit successfully
      mockAxios.post.mockResolvedValueOnce({
        status: 200,
        data: { data: { id: 'user-123' } },
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Test error message')
        ).not.toBeInTheDocument();
      });
    });

    it('should display error message with correct styling', async () => {
      mockAxios.post.mockRejectedValue(new Error('Login failed'));

      render(<LoginForm />);

      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      fireEvent.change(emailField, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordField, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Test error message');
        expect(errorMessage).toHaveClass('text-danger', 'mt-2');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and IDs', () => {
      render(<LoginForm />);

      const emailField = screen.getByTestId('email_field');
      const passwordField = screen.getByTestId('password_field');
      const loginButton = screen.getByText('Log In');

      expect(emailField).toHaveAttribute('id', 'email_field');
      expect(passwordField).toHaveAttribute('id', 'password_field');
      expect(loginButton).toHaveAttribute('id', 'login_button');
    });

    it('should have proper button type', () => {
      render(<LoginForm />);

      const loginButton = screen.getByText('Log In');
      expect(loginButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(<LoginForm />);

      const emailField = screen.getByTestId('email_field').parentElement;
      expect(emailField).toHaveClass('mb-4', 'md:mb-7');
    });

    it('should have proper field widths', () => {
      render(<LoginForm />);

      const emailField = screen.getByTestId('email_field').parentElement;
      const passwordField = screen.getByTestId('password_field').parentElement;

      expect(emailField).toHaveClass('w-[270px]');
      expect(passwordField).toHaveClass('w-[270px]');
    });
  });
});
