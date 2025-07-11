import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'request-id': uuidv4() },
  timeout: 60000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
