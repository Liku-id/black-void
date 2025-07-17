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
            append: headers.set.bind(headers),
            get: headers.get.bind(headers),
          },
        };
      }),
    },
  };
});

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('POST /api/logout', () => {
  const mockRequestBody = { device_id: 'mock-device' };

  const mockRequest = {
    json: jest.fn().mockResolvedValue(mockRequestBody),
    headers: {
      get: jest.fn().mockImplementation((key: string) => {
        if (key.toLowerCase() === 'authorization') {
          return 'Bearer mock-token';
        }
        return null;
      }),
    },
  } as unknown as NextRequest;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls axios, clears cookies, and returns 200', async () => {
    mockAxios.post.mockResolvedValueOnce({});

    const response = await POST(mockRequest);

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v1/auth/logout',
      mockRequestBody,
      { headers: { Authorization: 'Bearer mock-token' } }
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logout successful' });

    const expectedAccessTokenClear = serialize('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    const expectedRefreshTokenClear = serialize('refresh_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    expect((response.headers as any).get('Set-Cookie')).toBe(
      expectedRefreshTokenClear
    );
  });

  it('handles error correctly when axios fails', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Logout failed'));

    const response = await POST(mockRequest);

    expect(handleErrorAPI).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'error' });
  });
});
