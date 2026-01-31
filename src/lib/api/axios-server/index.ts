// axios-server.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const axiosInstance = axios.create({
  baseURL: 'https://api-staging-prem.wukong.co.id',
  headers: {
    'Content-Type': 'application/json',
    'request-id': uuidv4(),
  },
  timeout: 60000,
});

// Request interceptor (called manual token injection in API Routes)
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
