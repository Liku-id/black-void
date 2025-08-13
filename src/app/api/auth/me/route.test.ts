import { GET } from './route';
import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';

jest.mock('next/server', () => {
  const actualNext = jest.requireActual('next/server');
  return {
    ...actualNext,
    NextResponse: {
      json: jest.fn((body: any, init?: any) => ({
        status: init?.status || 200,
        body,
      })),
    },
  };
});

jest.mock('@/lib/api/axios-server', () => ({
  get: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api/check-login', () => {
  const createMockRequest = (cookies: Record<string, string>) =>
    ({
      cookies: {
        get: (key: string) =>
          cookies[key] ? { name: key, value: cookies[key] } : undefined,
      },
    }) as unknown as NextRequest;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns loggedIn: true when access_token exists', async () => {
    mockAxios.get.mockResolvedValue({
      data: { body: { id: 1, name: 'Test User' } },
    });

    const request = createMockRequest({ access_token: 'mock-token' });
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('loggedIn');
  });

  it('returns loggedIn: false when access_token does not exist', async () => {
    const request = createMockRequest({});
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('loggedIn');
  });
});
