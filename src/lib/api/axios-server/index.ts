import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'request-id': uuidv4() },
  timeout: 60000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // If running on client-side, add auth token
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (token expired)
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      // Token expired - clear session and redirect to login
      if (typeof window !== 'undefined') {
        // Clear session
        document.cookie =
          'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie =
          'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
