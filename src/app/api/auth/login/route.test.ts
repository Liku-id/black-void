import { POST } from './route';
import { serialize } from 'cookie';
import { NextRequest } from 'next/server';

jest.mock('@/lib/api/axios-server', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('@/lib/api/error-handler', () => ({
  handleErrorAPI: jest.fn(),
}));

import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';

const mockSet = jest.fn();
const mockAppend = jest.fn();

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(() => ({
      headers: {
        set: mockSet,
        append: mockAppend,
      },
    })),
  },
  NextRequest: class {},
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedHandleError = handleErrorAPI as jest.Mock;

describe('POST /api/login', () => {
  const mockRequestJson = jest.fn();
  const mockRequest = {
    json: mockRequestJson,
  } as unknown as NextRequest;

  const accessToken = 'access123';
  const refreshToken = 'refresh456';
  const mockFormData = { email: 'test@mail.com', password: 'secret' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success response and set cookies', async () => {
    mockRequestJson.mockResolvedValueOnce(mockFormData);
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    });

    const result = await POST(mockRequest);

    expect(mockRequestJson).toHaveBeenCalled();
    expect(mockedAxios.post).toHaveBeenCalledWith('/v1/login', mockFormData);

    expect(mockSet).toHaveBeenCalledWith(
      'Set-Cookie',
      serialize('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24,
      })
    );

    expect(mockAppend).toHaveBeenCalledWith(
      'Set-Cookie',
      serialize('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    );
  });

  it('should handle error via handleErrorAPI', async () => {
    const mockError = new Error('fail');
    mockRequestJson.mockResolvedValueOnce(mockFormData);
    mockedAxios.post.mockRejectedValueOnce(mockError);

    const mockErrorResponse = { status: 500 };
    mockedHandleError.mockReturnValueOnce(mockErrorResponse);

    const result = await POST(mockRequest);

    expect(mockedHandleError).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockErrorResponse);
  });
});
