import { POST } from './route';
import { NextRequest } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';

jest.mock('@/lib/api/axios-server');
jest.mock('@/lib/api/error-handler', () => ({
  handleErrorAPI: jest.fn(() => ({
    status: 400,
    body: { message: 'Already exists' },
  })),
}));

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

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('POST /api/auth/check-availability', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends email and phoneNumber separately using Promise.all when both are provided and both valid', async () => {
    mockAxios.post.mockResolvedValue({ data: { body: { isValid: true } } });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        phoneNumber: '+628123456789',
      }),
    } as unknown as NextRequest;

    const response: any = await POST(mockRequest);

    expect(mockAxios.post).toHaveBeenCalledTimes(2);
    expect(mockAxios.post).toHaveBeenCalledWith('/v1/users/check-availability', {
      email: 'test@example.com',
    });
    expect(mockAxios.post).toHaveBeenCalledWith('/v1/users/check-availability', {
      phoneNumber: '+628123456789',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'User available',
      success: true,
      isValid: true,
    });
  });

  it('returns specific message when email is already registered (isValid: false)', async () => {
    mockAxios.post.mockImplementation((url: string, payload: any) => {
      if (payload.email) {
        return Promise.resolve({ data: { body: { isValid: false } } });
      }
      return Promise.resolve({ data: { body: { isValid: true } } });
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'registered@example.com',
        phoneNumber: '+628123456789',
      }),
    } as unknown as NextRequest;

    const response: any = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Email is already registered. Sign in?',
      success: true,
      isValid: false,
    });
  });

  it('returns specific message when phone number is already registered (isValid: false)', async () => {
    mockAxios.post.mockImplementation((url: string, payload: any) => {
      if (payload.phoneNumber) {
        return Promise.resolve({ data: { body: { isValid: false } } });
      }
      return Promise.resolve({ data: { body: { isValid: true } } });
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'new@example.com',
        phoneNumber: '+628123456789',
      }),
    } as unknown as NextRequest;

    const response: any = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Phone number is already registered',
      success: true,
      isValid: false,
    });
  });

  it('sends only email when only email is provided', async () => {
    mockAxios.post.mockResolvedValue({ data: { body: { isValid: true } } });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
      }),
    } as unknown as NextRequest;

    const response: any = await POST(mockRequest);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith('/v1/users/check-availability', {
      email: 'test@example.com',
    });
    expect(response.status).toBe(200);
    expect(response.body.isValid).toBe(true);
  });

  it('catches and forwards error when one request fails in Promise.all', async () => {
    mockAxios.post.mockImplementation((url: string, payload: any) => {
      if (payload.email) {
        return Promise.reject(new Error('Email already taken'));
      }
      return Promise.resolve({ data: { body: { isValid: true } } });
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'existing@example.com',
        phoneNumber: '+628123456789',
      }),
    } as unknown as NextRequest;

    const response: any = await POST(mockRequest);

    expect(handleErrorAPI).toHaveBeenCalled();
    expect(response.status).toBe(400);
  });
});
