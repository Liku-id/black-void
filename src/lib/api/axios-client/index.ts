/* eslint-disable @typescript-eslint/no-explicit-any */
import { setSessionStorage } from '@/lib/browser-storage';
import Axios from 'axios';

// Create Axios instance
const axios = Axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

const logoutUser = async () => {
  try {
    await axios.post('/api/auth/logout');
  } catch (err) {
    console.error('Error logging out:', err);
  } finally {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      setSessionStorage('destination', currentPath);
      window.location.href = '/login';
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
      await logoutUser();
    }

    return Promise.reject(error);
  }
);

export default axios;
