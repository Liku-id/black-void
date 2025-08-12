import { renderHook, act } from '@testing-library/react';
import { useAuth } from './use-auth';

// Mock dependencies
jest.mock('jotai', () => ({
  useAtom: jest.fn(),
}));

jest.mock('@/lib/api/axios-client', () => ({
  default: {
    get: jest.fn(),
  },
}));

// Mock the store to prevent jotai atom errors
jest.mock('@/store', () => ({
  authAtom: {},
}));

const mockUseAtom = require('jotai').useAtom;
const mockAxios = require('@/lib/api/axios-client').default;

describe('useAuth Hook', () => {
  const mockSetAuth = jest.fn();
  const mockAuthState = {
    isLoggedIn: false,
    userData: null,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAtom.mockReturnValue([mockAuthState, mockSetAuth]);
  });

  describe('Initial State', () => {
    it('should return initial auth state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.userData).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(typeof result.current.checkAuth).toBe('function');
      expect(typeof result.current.setAuthUser).toBe('function');
    });
  });

  describe('setAuthUser', () => {
    it('should set user data and logged in state', () => {
      const mockUser = { id: 1, name: 'Test User' };
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.setAuthUser(mockUser);
      });

      expect(mockSetAuth).toHaveBeenCalledWith({
        isLoggedIn: true,
        userData: mockUser,
        loading: false,
      });
    });

    it('should handle different user data types', () => {
      const mockUser = { id: '123', email: 'test@example.com', role: 'admin' };
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.setAuthUser(mockUser);
      });

      expect(mockSetAuth).toHaveBeenCalledWith({
        isLoggedIn: true,
        userData: mockUser,
        loading: false,
      });
    });

    it('should handle null user data', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.setAuthUser(null);
      });

      expect(mockSetAuth).toHaveBeenCalledWith({
        isLoggedIn: true,
        userData: null,
        loading: false,
      });
    });
  });

  describe('Hook Return Value', () => {
    it('should return auth state and functions', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current).toHaveProperty('isLoggedIn');
      expect(result.current).toHaveProperty('userData');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('checkAuth');
      expect(result.current).toHaveProperty('setAuthUser');
    });

    it('should return checkAuth as a function', () => {
      const { result } = renderHook(() => useAuth());

      expect(typeof result.current.checkAuth).toBe('function');
    });

    it('should return setAuthUser as a function', () => {
      const { result } = renderHook(() => useAuth());

      expect(typeof result.current.setAuthUser).toBe('function');
    });
  });

  describe('Function Properties', () => {
    it('should have checkAuth function that can be called', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.checkAuth).toBeDefined();
      expect(typeof result.current.checkAuth).toBe('function');
    });

    it('should have setAuthUser function that can be called', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.setAuthUser).toBeDefined();
      expect(typeof result.current.setAuthUser).toBe('function');
    });
  });

  describe('State Properties', () => {
    it('should return isLoggedIn from auth state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoggedIn).toBe(mockAuthState.isLoggedIn);
    });

    it('should return userData from auth state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.userData).toBe(mockAuthState.userData);
    });

    it('should return loading from auth state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(mockAuthState.loading);
    });
  });
});
