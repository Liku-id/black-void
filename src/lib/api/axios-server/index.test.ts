jest.unmock('axios');
import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from '.';

describe('Basic Axios Instance', () => {
  let mock: axiosMockAdapter;

  beforeEach(() => {
    mock = new axiosMockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should make a successful GET request', async () => {
    const mockData = { message: 'success' };
    mock.onGet('/test').reply(200, mockData);

    const response = await axiosInstance.get('/test');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it('should reject on network or server error', async () => {
    mock.onGet('/error').reply(500, { error: 'Something went wrong' });
    await expect(axiosInstance.get('/error')).rejects.toThrow();
  });

  it('should have default headers', () => {
    expect(axiosInstance.defaults.headers).toBeDefined();
    // Headers might be flattened or in common depending on axios version/config
    const contentType =
      axiosInstance.defaults.headers['Content-Type'] ||
      axiosInstance.defaults.headers.common?.['Content-Type'] ||
      axiosInstance.defaults.headers.post?.['Content-Type'];

    // If it's explicitly set in create(), it should be in defaults.headers
    expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
    expect(axiosInstance.defaults.headers['request-id']).toBeDefined();
  });
});
