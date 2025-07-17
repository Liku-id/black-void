import { GET } from './route';
import { NextRequest, NextResponse } from 'next/server';

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
    const request = createMockRequest({ access_token: 'mock-token' });
    const response = await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ loggedIn: true });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ loggedIn: true });
  });

  it('returns loggedIn: false when access_token does not exist', async () => {
    const request = createMockRequest({});
    const response = await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ loggedIn: false });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ loggedIn: false });
  });
});
