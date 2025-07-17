import { POST } from './route';
import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';

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
      json: jest.fn((body: any, init?: any) => ({
        status: init?.status || 200,
        body,
      })),
    },
  };
});

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('POST /api/otp/request', () => {
  const mockRequestBody = { phoneNumber: '+628123456789' };

  const mockRequest = {
    json: jest.fn().mockResolvedValue(mockRequestBody),
  } as unknown as NextRequest;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 response with success message when OTP is sent successfully', async () => {
    mockAxios.post.mockResolvedValueOnce({});

    const response = await POST(mockRequest);

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v1/auth/otp/request',
      mockRequestBody
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'OTP sent successfully',
      success: true,
    });
  });

  it('handles error correctly when axios fails', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Request failed'));

    const response = await POST(mockRequest);

    expect(handleErrorAPI).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'error' });
  });
});
