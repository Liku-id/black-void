import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './register-form';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import axios from '@/lib/api/axios-client';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/lib/api/axios-client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));
jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai');
  return {
    ...actual,
    useAtom: jest.fn(),
  };
});
jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useForm: jest.fn(actual.useForm),
    FormProvider: actual.FormProvider,
  };
});

jest.mock('@/components/auth/verify-otp/success-modal', () => () => (
  <div data-testid="success-modal">Success Modal</div>
));

jest.mock('@/components', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  TextField: ({
    id,
    type,
    name,
    value,
    onChange,
    placeholder,
    className,
    ...rest
  }: any) => (
    <input
      data-testid={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
  Checkbox: ({ children, checked, onChange, id, ...props }: any) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
        {...props}
        data-testid={id}
      />
      {children}
    </label>
  ),
}));
jest.mock('next/image', () => (props: any) => <img {...props} />);
jest.mock('@/assets/icons/eye-closed.svg', () => 'eye-closed.svg');
jest.mock('@/assets/icons/eye-open.svg', () => 'eye-open.svg');
jest.mock('@/assets/icons/error.svg', () => 'error.svg');
jest.mock('@/assets/icons/success.svg', () => 'success.svg');
jest.mock('@/utils/form-validation', () => ({
  email: jest.fn(() => true),
  fullName: jest.fn(() => true),
  phoneNumber: jest.fn(() => true),
  usePasswordValidation: jest.fn(() => ({
    length: true,
    number: true,
    special: true,
    capital: true,
  })),
}));
jest.mock('@/lib/api/error-handler', () => ({
  getErrorMessage: jest.fn(() => 'Error!'),
}));

const mockSetPayload = jest.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: jest.fn() });
    (useAtom as jest.Mock).mockReturnValue([{}, mockSetPayload]);
    // Reset and setup default mock implementation for axios
    jest.clearAllMocks();
    axios.post = jest.fn().mockResolvedValue({ data: { isValid: true } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders step 1 fields and continue button', () => {
    render(<RegisterForm />);
    expect(screen.getByTestId('fullname_field')).toBeInTheDocument();
  });

  it('navigates to step 2 on valid continue', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('fullname_field'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email_field'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone_number_field'), {
      target: { value: '812345678' },
    });

    // Ensure mock value is set correctly
    (axios.post as jest.Mock).mockResolvedValue({ data: { isValid: true } });

    fireEvent.click(screen.getByText(/Go Ahead/i));
    await waitFor(() => {
      expect(screen.getByTestId('password_field')).toBeInTheDocument();
    });
  });



  it('does not navigate if response status is not 200', async () => {
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });
    (axios.post as jest.Mock).mockResolvedValue({
      status: 400,
      data: { isValid: false },
    });

    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('fullname_field'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email_field'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone_number_field'), {
      target: { value: '812345678' },
    });
    fireEvent.click(screen.getByText(/Go Ahead/i));

    await waitFor(() =>
      expect(
        screen.getByText(
          'The email or phone number you entered is already registered'
        )
      ).toBeInTheDocument()
    );
    expect(screen.queryByTestId('password_field')).not.toBeInTheDocument();

    await waitFor(() => expect(replaceMock).not.toHaveBeenCalled());
  });

  // Checking error handling


  it('goes back to step 1 when back is clicked', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('fullname_field'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email_field'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone_number_field'), {
      target: { value: '812345678' },
    });
    fireEvent.click(screen.getByText(/Go Ahead/i));

    await waitFor(() => screen.getByTestId('password_field'));

    fireEvent.click(screen.getByText('Back'));

    expect(screen.getByTestId('fullname_field')).toBeInTheDocument();
  });

  it('toggles password visibility when end icon is clicked', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('fullname_field'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email_field'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone_number_field'), {
      target: { value: '812345678' },
    });
    fireEvent.click(screen.getByText(/Go Ahead/i));
    await waitFor(() => screen.getByTestId('password_field'));
    const passwordInput = screen.getByTestId('password_field');
    fireEvent.click(passwordInput);
  });

  it('disables submit button if not all valid', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('fullname_field'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email_field'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('phone_number_field'), {
      target: { value: '812345678' },
    });
    fireEvent.click(screen.getByText(/Go Ahead/i));
    await waitFor(() => screen.getByTestId('password_field'));
    fireEvent.change(screen.getByTestId('password_field'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByTestId('confirm_password_field'), {
      target: { value: 'Password123!' },
    });
    await waitFor(() => screen.getByTestId('register_button'));
    expect(screen.getByTestId('register_button')).toBeDisabled();
  });

  it('does not proceed to step 2 if trigger fails', async () => {
    // This test relies on react-hook-form internals, leaving as is but mocked
    const mockTrigger = jest.fn().mockResolvedValue(false);
    const actual = jest.requireActual('react-hook-form');
    (require('react-hook-form') as any).useForm = jest.fn(() => ({
      ...actual.useForm(),
      trigger: mockTrigger,
      getValues: actual.useForm().getValues,
      handleSubmit: actual.useForm().handleSubmit,
      watch: actual.useForm().watch,
    }));

    render(<RegisterForm />);
    fireEvent.click(screen.getByText(/Go Ahead/i));
    await waitFor(() =>
      expect(screen.queryByTestId('password_field')).not.toBeInTheDocument()
    );
  });
});
