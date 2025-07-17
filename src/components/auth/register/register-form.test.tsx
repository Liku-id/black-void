import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './register-form';
import { useRouter } from 'next/navigation';

import { useAtom } from 'jotai';
import axios from 'axios';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('axios');
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

// Mock child components used in RegisterForm
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

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ replace: jest.fn() });
  (useAtom as jest.Mock).mockReturnValue([{}, mockSetPayload]);
  jest.clearAllMocks();
});

describe('RegisterForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders step 1 fields and continue button', () => {
    render(<RegisterForm />);
    expect(screen.getByTestId('fullname_field')).toBeInTheDocument();
    expect(screen.getByTestId('email_field')).toBeInTheDocument();
    expect(screen.getByTestId('phone_number_field')).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
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
    fireEvent.click(screen.getByText(/Continue/i));
    await waitFor(() => {
      expect(screen.getByTestId('password_field')).toBeInTheDocument();
      expect(screen.getByTestId('repeat_password_field')).toBeInTheDocument();
    });
  });

  it('shows loading indicator when loading', async () => {
    (axios.post as jest.Mock).mockImplementation(() => new Promise(() => {}));
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
    fireEvent.click(screen.getByText(/Continue/i));

    await screen.findByTestId('password_field');

    fireEvent.change(screen.getByTestId('password_field'), {
      target: { value: 'Password1!' },
    });
    fireEvent.change(screen.getByTestId('repeat_password_field'), {
      target: { value: 'Password1!' },
    });
    fireEvent.click(screen.getByTestId('register_checkbox'));

    await waitFor(() =>
      expect(screen.getByTestId('register_button')).not.toBeDisabled()
    );

    fireEvent.click(screen.getByTestId('register_button'));

    expect(await screen.findByTestId('loading')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText(/Continue/i));
    await waitFor(() => screen.getByTestId('password_field'));
    // Do NOT check agreement checkbox
    fireEvent.change(screen.getByTestId('password_field'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByTestId('repeat_password_field'), {
      target: { value: 'Password123!' },
    });
    await waitFor(() => screen.getByTestId('register_button'));
    expect(screen.getByTestId('register_button')).toBeDisabled();
  });

  it('shows error message on API error', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('API Error'));
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
    fireEvent.click(screen.getByText(/Continue/i));
    await waitFor(() => screen.getByTestId('password_field'));
    fireEvent.change(screen.getByTestId('password_field'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByTestId('repeat_password_field'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByTestId('register_checkbox'));
    await waitFor(() => screen.getByTestId('register_button'));
    fireEvent.click(screen.getByTestId('register_button'));
    await waitFor(() => expect(screen.getByText('Error!')).toBeInTheDocument());
  });
});
