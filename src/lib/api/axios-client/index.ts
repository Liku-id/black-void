/* eslint-disable @typescript-eslint/no-explicit-any */
import { setSessionStorage } from '@/lib/browser-storage';
import Axios from 'axios';

// Create Axios instance
const axios = Axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const logoutUser = async () => {
  try {
    await axios.post('/api/auth/logout', { force: true });
  } catch (err) {
    console.error('Error logging out:', err);
  } finally {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      setSessionStorage('destination', currentPath);

      if (window.location.pathname.includes('/ticket/scanner')) {
        window.location.href = '/ticket/auth';
      } else {
        window.location.href = '/login';
      }
    }
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Handle token expiration errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axios(originalRequest)),
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post('/api/auth/refresh-token');

        processQueue();

        return axios(originalRequest);
      } catch (err) {
        console.error('Error refreshing token:', err);

        await logoutUser();
        processQueue(err);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
