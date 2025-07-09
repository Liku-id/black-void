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
      },
      { status: 401 }
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
      },
      { status: 503 }
    );
  });

  it('handles completely empty error', () => {
    const response = handleErrorAPI({});

    expect(mockJson).toHaveBeenCalledWith(
      {
        message: 'An unexpected error occurred.',
        traceId: '',
      },
      { status: 500 }
    );
  });
});

describe('getErrorMessage', () => {
  it('returns message from Axios error', () => {
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
