import { renderHook, act } from '@testing-library/react';
import { RefObject } from 'react';
import useStickyObserver from './index';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation(callback => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
  }));

  global.IntersectionObserver = mockIntersectionObserver;
  global.window.scrollY = 0;
  global.window.pageYOffset = 0;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useStickyObserver', () => {
  it('should initialize with default values', () => {
    const mockStickyRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;
    const mockSentinelRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;

    const { result } = renderHook(() =>
      useStickyObserver(mockStickyRef, mockSentinelRef, 0)
    );

    expect(result.current.isSticky).toBe(true);
    expect(result.current.absoluteTop).toBe(0);
    expect(result.current.isReady).toBe(false);
  });

  it('should set up intersection observer', () => {
    const mockStickyRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;
    const mockSentinelRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;

    renderHook(() => useStickyObserver(mockStickyRef, mockSentinelRef, 0));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { root: null, threshold: 0 }
    );
  });

  it('should handle intersection observer callback', () => {
    const mockStickyRef = {
      current: {
        offsetHeight: 100,
        getBoundingClientRect: () => ({ top: 200 }),
      } as unknown as HTMLDivElement,
    } as RefObject<HTMLDivElement>;
    const mockSentinelRef = {
      current: {
        getBoundingClientRect: () => ({ top: 300 }),
      } as unknown as HTMLDivElement,
    } as RefObject<HTMLDivElement>;

    let observerCallback: any;
    mockIntersectionObserver.mockImplementation(callback => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() =>
      useStickyObserver(mockStickyRef, mockSentinelRef, 50)
    );

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.isSticky).toBe(false);
  });

  it('should handle window resize', () => {
    const mockStickyRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;
    const mockSentinelRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useStickyObserver(mockStickyRef, mockSentinelRef, 0)
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});
