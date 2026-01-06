import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from '.';
import { v4 as uuidv4 } from 'uuid';

jest.unmock('axios');

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

  it('should use correct baseURL and headers', () => {
    // baseURL is '' in implementation
    expect(axiosInstance.defaults.baseURL).toBe('');
    expect(axiosInstance.defaults.headers['Content-Type']).toBe(
      'application/json'
    );
  });
});
