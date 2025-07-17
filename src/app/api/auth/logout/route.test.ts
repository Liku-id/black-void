import { POST } from './route';
import { NextRequest, NextResponse } from 'next/server';
import axiosInstance from 'services/axios-server';
import { serialize } from 'cookie';
import { handleServerError } from 'services/error-handler';

jest.mock('services/axios-server');
jest.mock('services/error-handler');

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;
const mockedHandleServerError = handleServerError as jest.Mock;

const mockHeaders = {
  append: jest.fn(),
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(() => ({
      headers: {
        append: mockHeaders.append,
      },
    })),
  },
  NextRequest: class {},
}));

describe('POST /logout', () => {
  const mockRequest = {
    headers: {
      get: jest.fn().mockReturnValue('Bearer test-token'),
    },
  } as unknown as NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should logout and clear access and refresh tokens', async () => {
    mockedAxios.post.mockResolvedValueOnce({});

    const result = await POST(mockRequest);

    expect(mockRequest.headers.get).toHaveBeenCalledWith('authorization');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/auth/v1/user/logout',
      null,
      {
        headers: {
          Authorization: 'Bearer test-token',
        },
      }
    );

    expect(mockHeaders.append).toHaveBeenCalledWith(
      'Set-Cookie',
      serialize('access_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      })
    );

    expect(mockHeaders.append).toHaveBeenCalledWith(
      'Set-Cookie',
      serialize('refresh_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      })
    );

    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Logout successful',
    });

    expect(result.headers).toBeDefined();
  });

  it('should handle error using handleServerError', async () => {
    const error = new Error('logout failed');
    mockedAxios.post.mockRejectedValueOnce(error);

    const mockErrorResponse = { status: 500 };
    mockedHandleServerError.mockReturnValueOnce(mockErrorResponse);

    const result = await POST(mockRequest);

    expect(mockedHandleServerError).toHaveBeenCalledWith(error);
    expect(result).toBe(mockErrorResponse);
  });
});
