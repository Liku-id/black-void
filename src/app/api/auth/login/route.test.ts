import { POST } from './route';
import { NextRequest } from 'next/server';
import axios from '@/lib/api/axios-server';
import { setAuthCookies } from '@/lib/session';

jest.mock('@/lib/api/axios-server');
jest.mock('@/lib/session', () => ({
  setAuthCookies: jest.fn(),
}));

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
  const mockRequestBody = {
    form: { email: 'test@example.com', password: 'password' },
  };
  const mockUser = { id: 1, name: 'John Doe', role: 'admin' };
  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  const mockRequest = {
    json: jest.fn().mockReturnValue(mockRequestBody),
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
      mockRequestBody.form
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login success',
      success: true,
      data: mockUser,
    });

    expect(setAuthCookies).toHaveBeenCalledWith({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      userRole: mockUser.role, // assuming mockUser has role, wait mockUser definition in test?
    });
  });

  it('handles error correctly when axios fails', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Request failed'));

    const response = await POST(mockRequest);

    // expect(handleErrorAPI).toHaveBeenCalled(); // Implementation does manual handling
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'An error occurred',
      data: null,
      success: false,
    });
  });
});
