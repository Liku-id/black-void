import { POST } from './route';
import axios from '@/lib/api/axios-server';

jest.mock('@/lib/api/axios-server');

const mockJson = jest.fn();
const mockReturn = (data: any) => ({ json: () => data });

const createRequest = (body: any) => ({ json: async () => body }) as any;

// Mock NextResponse.json to avoid cookies error in test environment
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any) => ({
      json: async () => data,
    }),
  },
}));

describe('/api/auth/forgot-password POST', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success response when axios resolves', async () => {
    (axios.post as jest.Mock).mockResolvedValue({});
    const req = createRequest({ email: 'test@example.com' });
    const res = await POST(req);
    const json = await res.json();
    expect(json).toMatchObject({
      message: 'Forgot password email sent',
      success: true,
    });
    expect(axios.post).toHaveBeenCalledWith('/v1/auth/password/request', {
      email: 'test@example.com',
    });
  });

  it('returns error response when axios rejects', async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: { message: 'error' } },
    });
    const req = createRequest({ email: 'fail@example.com' });
    const res = await POST(req);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBeDefined();
  });
});
