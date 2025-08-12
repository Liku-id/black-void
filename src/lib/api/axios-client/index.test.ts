import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from '.';
import { v4 as uuidv4 } from 'uuid';

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

    await expect(axiosInstance.get('/error')).rejects.toMatchObject({
      response: {
        status: 500,
        data: { error: 'Something went wrong' },
      },
    });
  });

  it('should include request-id header in request', async () => {
    const spy = jest.fn();
    mock.onGet('/headers').reply(config => {
      if (config.headers && 'request-id' in config.headers) {
        spy(config.headers['request-id']);
      } else {
        spy(undefined);
      }
      return [200, { ok: true }];
    });

    await axiosInstance.get('/headers');

    expect(spy).toHaveBeenCalledWith(expect.any(String));
  });

  it('should use correct baseURL and headers', () => {
    expect(axiosInstance.defaults.baseURL).toBe(process.env.API_BASE_URL);
    expect(axiosInstance.defaults.headers['Content-Type']).toBe(
      'application/json'
    );
    expect(axiosInstance.defaults.headers['request-id']).toBeDefined();
  });
});
