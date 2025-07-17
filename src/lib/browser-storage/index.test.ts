import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
} from '.';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Local Storage', () => {
    it('should set and get a string value from localStorage', () => {
      setLocalStorage('username', 'john');
      const result = getLocalStorage<string>('username');
      expect(result).toBe('john');
    });

    it('should set and get an object from localStorage', () => {
      const obj = { name: 'Jane', age: 30 };
      setLocalStorage('user', obj);
      const result = getLocalStorage<typeof obj>('user', 'object');
      expect(result).toEqual(obj);
    });

    it('should return null for missing key in localStorage', () => {
      const result = getLocalStorage<string>('nonexistent');
      expect(result).toBeNull();
    });

    it('should remove a value from localStorage', () => {
      setLocalStorage('temp', 'data');
      removeLocalStorage('temp');
      const result = getLocalStorage('temp');
      expect(result).toBeNull();
    });

    it('should handle malformed JSON gracefully in localStorage', () => {
      localStorage.setItem('broken', '{ invalid json');
      const result = getLocalStorage('broken', 'object');
      expect(result).toBeNull();
    });
  });

  describe('Session Storage', () => {
    it('should set and get a string value from sessionStorage', () => {
      setSessionStorage('token', 'abc123');
      const result = getSessionStorage<string>('token');
      expect(result).toBe('abc123');
    });

    it('should return null for missing key in sessionStorage', () => {
      const result = getSessionStorage('doesNotExist');
      expect(result).toBeNull();
    });

    it('should remove a value from sessionStorage', () => {
      setSessionStorage('key', 'value');
      removeSessionStorage('key');
      const result = getSessionStorage('key');
      expect(result).toBeNull();
    });
  });
});
