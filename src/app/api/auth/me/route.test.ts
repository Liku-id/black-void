/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET } from './route';
import { NextRequest } from 'next/server';

const mockJson = jest.fn();

jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => mockJson(...args),
  },
  NextRequest: class {},
}));

describe('GET /logged-in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loggedIn: false if access_token is not present', async () => {
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockRequest.cookies.get).toHaveBeenCalledWith('access_token');
    expect(mockJson).toHaveBeenCalledWith({ loggedIn: false });
  });

  it('should return loggedIn: true if access_token exists', async () => {
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'token123' }),
      },
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockRequest.cookies.get).toHaveBeenCalledWith('access_token');
    expect(mockJson).toHaveBeenCalledWith({ loggedIn: true });
  });
});
