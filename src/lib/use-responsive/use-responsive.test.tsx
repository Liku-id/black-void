import { renderHook } from '@testing-library/react';
import { useResponsive, defaultBreakpoints, BreakpointMap } from './index';

// Helper to mock matchMedia for a specific min-width
function createMatchMedia(activeMinWidth: number) {
  return (query: string) => {
    // Extract px value from query
    const px = parseInt(query.match(/\d+/)?.[0] || '0', 10);
    return {
      matches: activeMinWidth >= px,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
}

describe('useResponsive', () => {
  let originalWindow: any;
  beforeEach(() => {
    originalWindow = global.window;
    if (typeof window === 'undefined') {
      // @ts-ignore
      global.window = {};
    }
  });
  afterEach(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      delete window.matchMedia;
    }
    if (originalWindow) {
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        writable: true,
      });
    }
  });

  it('returns correct viewport object for breakpoints (lg: 1024px)', () => {
    window.matchMedia = createMatchMedia(1024) as any;
    const { result } = renderHook(() => useResponsive());
    expect(result.current.sm).toBe(true); // 640 <= 1024
    expect(result.current.md).toBe(true); // 768 <= 1024
    expect(result.current.lg).toBe(true); // 1024 <= 1024
    expect(result.current.xl).toBe(false); // 1280 > 1024
    expect(result.current['2xl']).toBe(false); // 1536 > 1024
  });

  it('returns all false for <640px', () => {
    window.matchMedia = createMatchMedia(0) as any;
    const { result } = renderHook(() => useResponsive());
    expect(result.current.sm).toBe(false);
    expect(result.current.md).toBe(false);
    expect(result.current.lg).toBe(false);
    expect(result.current.xl).toBe(false);
    expect(result.current['2xl']).toBe(false);
  });
});

describe('useResponsive SSR', () => {
  let originalMatchMedia: any;
  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    // Simulasikan SSR: matchMedia tidak ada
    // @ts-ignore
    window.matchMedia = undefined;
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns initialViewport on SSR (no window.matchMedia)', () => {
    const initial = { sm: true, md: false, lg: false, xl: false, '2xl': false };
    const { result } = renderHook(() => useResponsive(undefined, initial));
    expect(result.current).toEqual(initial);
  });
});

describe('useResponsive - additional coverage', () => {
  afterEach(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      delete window.matchMedia;
    }
  });

  it('supports custom breakpoints', () => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      // Custom: only 500px matches
      return {
        matches: /500/.test(query),
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    const customBreakpoints = { mobile: 500, desktop: 1000 };
    const { result } = renderHook(() => useResponsive(customBreakpoints));
    expect(result.current.mobile).toBe(true);
    expect(result.current.desktop).toBe(false);
  });

  it('removes event listener on unmount', () => {
    window.matchMedia = createMatchMedia(1024) as any;
    const add = jest.spyOn(window, 'addEventListener');
    const remove = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useResponsive());
    expect(add).toHaveBeenCalledWith('resize', expect.any(Function));
    unmount();
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
    add.mockRestore();
    remove.mockRestore();
  });
});
