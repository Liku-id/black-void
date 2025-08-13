import axiosInstance from './index';

describe('Axios Server', () => {
  describe('Module Export', () => {
    it('should export an axios instance', () => {
      expect(axiosInstance).toBeDefined();
    });

    it('should have axios-like properties', () => {
      expect(axiosInstance).toHaveProperty('defaults');
      expect(axiosInstance).toHaveProperty('interceptors');
    });
  });

  describe('Instance Configuration', () => {
    it('should have defaults property', () => {
      expect(axiosInstance.defaults).toBeDefined();
    });

    it('should have interceptors property', () => {
      expect(axiosInstance.interceptors).toBeDefined();
    });

    it('should have request interceptor', () => {
      expect(axiosInstance.interceptors.request).toBeDefined();
    });

    it('should have response interceptor', () => {
      expect(axiosInstance.interceptors.response).toBeDefined();
    });
  });

  describe('HTTP Methods', () => {
    it('should have GET method', () => {
      expect(typeof axiosInstance.get).toBe('function');
    });

    it('should have POST method', () => {
      expect(typeof axiosInstance.post).toBe('function');
    });

    it('should have PUT method', () => {
      expect(typeof axiosInstance.put).toBe('function');
    });

    it('should have DELETE method', () => {
      expect(typeof axiosInstance.delete).toBe('function');
    });
  });

  describe('Interceptor Setup', () => {
    it('should have request interceptor configured', () => {
      expect(axiosInstance.interceptors.request).toBeDefined();
    });

    it('should have response interceptor configured', () => {
      expect(axiosInstance.interceptors.response).toBeDefined();
    });
  });

  describe('Instance Properties', () => {
    it('should have defaults property', () => {
      expect(axiosInstance.defaults).toBeDefined();
    });

    it('should have interceptors property', () => {
      expect(axiosInstance.interceptors).toBeDefined();
    });

    it('should have request interceptor', () => {
      expect(axiosInstance.interceptors.request).toBeDefined();
    });

    it('should have response interceptor', () => {
      expect(axiosInstance.interceptors.response).toBeDefined();
    });
  });
});
