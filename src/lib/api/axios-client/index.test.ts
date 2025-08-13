import axios from './index';

describe('Axios Client', () => {
  describe('Module Export', () => {
    it('should export an axios instance', () => {
      expect(axios).toBeDefined();
    });

    it('should have axios-like properties', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance).toHaveProperty('defaults');
      expect(axiosInstance).toHaveProperty('interceptors');
    });
  });

  describe('Instance Configuration', () => {
    it('should have defaults property', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance.defaults).toBeDefined();
    });

    it('should have interceptors property', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance.interceptors).toBeDefined();
    });

    it('should have request interceptor', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance.interceptors.request).toBeDefined();
    });

    it('should have response interceptor', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance.interceptors.response).toBeDefined();
    });
  });

  describe('HTTP Methods', () => {
    it('should have GET method', () => {
      const axiosInstance = (axios as any).default;
      expect(typeof axiosInstance.get).toBe('function');
    });

    it('should have POST method', () => {
      const axiosInstance = (axios as any).default;
      expect(typeof axiosInstance.post).toBe('function');
    });

    it('should have PUT method', () => {
      const axiosInstance = (axios as any).default;
      expect(typeof axiosInstance.put).toBe('function');
    });

    it('should have DELETE method', () => {
      const axiosInstance = (axios as any).default;
      expect(typeof axiosInstance.delete).toBe('function');
    });
  });

  describe('Interceptor Setup', () => {
    it('should have response interceptor configured', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance.interceptors.response).toBeDefined();
    });

    it('should have request interceptor configured', () => {
      const axiosInstance = (axios as any).default;
      expect(axiosInstance.interceptors.request).toBeDefined();
    });
  });
});
