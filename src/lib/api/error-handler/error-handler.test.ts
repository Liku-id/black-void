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
        traceId: 'trace-123',
        success: false,
      },
      { status: 401 },
    );

    expect(response.status).toBe(401);
  });

  it('handles error without response', () => {
    const error = {
      message: 'Server down',
      status: 503,
    };

    const response = handleErrorAPI(error);

    expect(mockJson).toHaveBeenCalledWith(
      {
        message: 'Server down',
        traceId: '',
        success: false,
      },
      { status: 503 },
    );
  });

  it('handles completely empty error', () => {
    const response = handleErrorAPI({});

    expect(mockJson).toHaveBeenCalledWith(
      {
        message: 'An unexpected error occurred.',
        traceId: '',
        success: false,
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
    // Without URL context, 'Invalid credentials' doesn't match any mapping
    expect(message).toBe('An error occurred. Please try again later');
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
    expect(message).toBe("Email & password doesn't match");
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
      'Too many requests. Please wait for 3 minutes to try again.',
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
    expect(message).toBe('Email is already registered. Sign in?');
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
    expect(message).toBe('Please input a valid phone number');
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
    expect(message).toBe('This ticket type is sold out');
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
      'An unexpected error occurred. Please try again later.',
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
