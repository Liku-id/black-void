import { handleErrorAPI, getErrorMessage } from './index';
import { NextResponse } from 'next/server';
import { AxiosError } from 'axios';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status })),
  },
}));

describe('handleErrorAPI', () => {
  const mockJson = NextResponse.json as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns response with full error info', () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Unauthorized',
          traceId: 'trace-123',
        },
        status: 401,
      },
    };

    const response = handleErrorAPI(error);

    expect(mockJson).toHaveBeenCalledWith(
      {
        message: 'Unauthorized',
        code: undefined,
        detail: undefined,
      },
      { status: 401 },
    );

    expect(response.status).toBe(401);
  });

  it('handles error without response', () => {
    const error = new Error('Server down');

    const response = handleErrorAPI(error);

    expect(mockJson).toHaveBeenCalledWith(
      {
        message: 'Server down',
      },
      { status: 500 },
    );
  });

  it('handles completely empty error', () => {
    const response = handleErrorAPI({});

    expect(mockJson).toHaveBeenCalledWith(
      {
        message: 'An unexpected error occurred.',
      },
      { status: 500 },
    );
  });
});

describe('getErrorMessage', () => {
  it('returns fallback when no URL context and message is unmapped', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    } as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe('Invalid credentials');
  });

  it('maps login wrong password error to user-friendly message', () => {
    const axiosError = {
      isAxiosError: true,
      config: { url: '/api/auth/login' },
      response: {
        status: 401,
        data: {
          message: 'Wrong password',
        },
      },
    } as unknown as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe("Wrong password");
  });

  it('maps login rate limit error correctly', () => {
    const axiosError = {
      isAxiosError: true,
      config: { url: '/api/auth/login' },
      response: {
        status: 429,
        data: {
          message: 'Too many login attempts',
        },
      },
    } as unknown as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe(
      'Too many login attempts',
    );
  });

  it('maps register duplicate email error correctly', () => {
    const axiosError = {
      isAxiosError: true,
      config: { url: '/api/auth/register' },
      response: {
        status: 409,
        data: {
          message: 'Email is already registered',
        },
      },
    } as unknown as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe('Email is already registered');
  });

  it('maps OTP phone number format error correctly', () => {
    const axiosError = {
      isAxiosError: true,
      config: { url: '/api/auth/request-otp' },
      response: {
        status: 400,
        data: {
          message: 'Invalid phone number format',
        },
      },
    } as unknown as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe('Invalid phone number format');
  });

  it('maps create order sold out error correctly', () => {
    const axiosError = {
      isAxiosError: true,
      config: { url: '/api/order/create' },
      response: {
        status: 400,
        data: {
          message: 'Ticket sold out',
        },
      },
    } as unknown as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe('Ticket sold out');
  });

  it('falls back to status code message when no pattern matches', () => {
    const axiosError = {
      isAxiosError: true,
      config: { url: '/api/some-unknown-endpoint' },
      response: {
        status: 500,
        data: {
          message: 'some random backend error',
        },
      },
    } as unknown as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe(
      'some random backend error',
    );
  });

  it('returns fallback message if no response message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {},
      },
    } as AxiosError;

    const message = getErrorMessage(axiosError);
    expect(message).toBe('An error occurred. Please try again later');
  });

  it('returns default message for unknown error', () => {
    const message = getErrorMessage('some unknown error');
    expect(message).toBe('An unexpected error occurred');
  });
});
