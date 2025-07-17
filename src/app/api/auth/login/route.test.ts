import { POST } from './route';
import { NextRequest } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import { serialize } from 'cookie';

jest.mock('@/lib/api/axios-server');
jest.mock('@/lib/api/error-handler', () => ({
  handleErrorAPI: jest.fn(() => ({
    status: 500,
    body: { error: 'error' },
  })),
}));

jest.mock('next/server', () => {
  const actualNext = jest.requireActual('next/server');
  return {
    ...actualNext,
    NextResponse: {
      json: jest.fn((body: any, init?: any) => {
        const headers = new Map();
        return {
          status: init?.status || 200,
          body,
          headers: {
            set: headers.set.bind(headers),
            append: headers.set.bind(headers),
            get: headers.get.bind(headers),
          },
        };
      }),
    },
  };
});

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('POST /api/auth/login', () => {
  const mockRequestBody = { email: 'test@example.com', password: 'password' };
  const mockUser = { id: 1, name: 'John Doe' };
  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  const mockRequest = {
    json: jest.fn().mockResolvedValue(mockRequestBody),
  } as unknown as NextRequest;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with user data and sets access_token and refresh_token cookies', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        body: {
          user: mockUser,
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        },
      },
    });

    const response = await POST(mockRequest);

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v1/auth/login',
      mockRequestBody
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login success',
      success: true,
      data: mockUser,
    });

    const expectedAccessTokenCookie = serialize(
      'access_token',
      mockAccessToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24,
      }
    );

    const expectedRefreshTokenCookie = serialize(
      'refresh_token',
      mockRefreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    expect((response.headers as any).get('Set-Cookie')).toBe(
      expectedRefreshTokenCookie
    );
  });

  it('handles error correctly when axios fails', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Request failed'));

    const response = await POST(mockRequest);

    expect(handleErrorAPI).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'error' });
  });
});
