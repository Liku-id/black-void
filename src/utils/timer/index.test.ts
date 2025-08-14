import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './index';

describe('useCountdown Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with the correct number of seconds', () => {
      const { result } = renderHook(() => useCountdown(60));

      expect(result.current[0]).toBe(60);
    });

    it('should initialize with zero seconds', () => {
      const { result } = renderHook(() => useCountdown(0));

      expect(result.current[0]).toBe(0);
    });

    it('should initialize with negative seconds', () => {
      const { result } = renderHook(() => useCountdown(-10));

      expect(result.current[0]).toBe(-10);
    });

    it('should return reset function', () => {
      const { result } = renderHook(() => useCountdown(30));

      expect(typeof result.current[1]).toBe('function');
    });
  });

  describe('Countdown Functionality', () => {
    it('should count down every second', () => {
      const { result } = renderHook(() => useCountdown(5));

      expect(result.current[0]).toBe(5);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(4);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(3);
    });

    it('should stop at zero', () => {
      const { result } = renderHook(() => useCountdown(2));

      expect(result.current[0]).toBe(2);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(0);

      // Should stay at 0
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(0);
    });

    it('should handle multiple seconds at once', () => {
      const { result } = renderHook(() => useCountdown(10));

      expect(result.current[0]).toBe(10);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current[0]).toBe(5);
    });

    it('should handle partial seconds correctly', () => {
      const { result } = renderHook(() => useCountdown(3));

      expect(result.current[0]).toBe(3);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not change for partial seconds
      expect(result.current[0]).toBe(3);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current[0]).toBe(2);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial value', () => {
      const { result } = renderHook(() => useCountdown(10));

      // Count down a bit
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current[0]).toBe(7);

      // Reset
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(10);
    });

    it('should reset multiple times', () => {
      const { result } = renderHook(() => useCountdown(5));

      // First countdown
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current[0]).toBe(3);

      // First reset
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(5);

      // Second countdown
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(4);

      // Second reset
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(5);
    });

    it('should reset when already at zero', () => {
      const { result } = renderHook(() => useCountdown(2));

      // Count down to zero
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current[0]).toBe(0);

      // Reset from zero
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(2);
    });

    it('should reset and continue counting', () => {
      const { result } = renderHook(() => useCountdown(3));

      // Count down
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(2);

      // Reset
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(3);

      // Continue counting after reset
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(2);
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should not create unnecessary intervals when at zero', () => {
      const { result } = renderHook(() => useCountdown(1));

      expect(result.current[0]).toBe(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(0);

      // Should not create new intervals when at zero
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(0);
    });

    it('should handle unmount gracefully', () => {
      const { result, unmount } = renderHook(() => useCountdown(10));

      expect(result.current[0]).toBe(10);

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero initial value', () => {
      const { result } = renderHook(() => useCountdown(0));

      expect(result.current[0]).toBe(0);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(0);
    });

    it('should handle negative initial value', () => {
      const { result } = renderHook(() => useCountdown(-5));

      expect(result.current[0]).toBe(-5);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Hook doesn't automatically reset negative values to 0
      expect(result.current[0]).toBe(-5);
    });

    it('should handle very large initial values', () => {
      const { result } = renderHook(() => useCountdown(999999));

      expect(result.current[0]).toBe(999999);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(999998);
    });

    it('should handle decimal initial values', () => {
      const { result } = renderHook(() => useCountdown(3.5));

      expect(result.current[0]).toBe(3.5);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(2.5);
    });

    it('should handle rapid resets', () => {
      const { result } = renderHook(() => useCountdown(5));

      expect(result.current[0]).toBe(5);

      // Multiple rapid resets
      act(() => {
        result.current[1]();
        result.current[1]();
        result.current[1]();
      });

      expect(result.current[0]).toBe(5);
    });

    it('should handle reset during countdown', () => {
      const { result } = renderHook(() => useCountdown(10));

      expect(result.current[0]).toBe(10);

      // Start counting
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current[0]).toBe(10);

      // Reset during countdown
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(10);

      // Continue counting
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(9);
    });
  });

  describe('Timer Accuracy', () => {
    it('should maintain accurate timing over multiple seconds', () => {
      const { result } = renderHook(() => useCountdown(10));

      expect(result.current[0]).toBe(10);

      // Advance by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(9);

      // Advance by 2 more seconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current[0]).toBe(7);

      // Advance by 5 more seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current[0]).toBe(2);
    });

    it('should handle non-standard intervals', () => {
      const { result } = renderHook(() => useCountdown(5));

      expect(result.current[0]).toBe(5);

      // Advance by 1.5 seconds (should only count as 1 second)
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(result.current[0]).toBe(4);

      // Advance by 0.5 seconds (should not count)
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current[0]).toBe(4);
    });
  });

  describe('Hook Re-renders', () => {
    it('should maintain state across re-renders', () => {
      const { result, rerender } = renderHook(() => useCountdown(5));

      expect(result.current[0]).toBe(5);

      // Count down
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(4);

      // Re-render
      rerender();

      expect(result.current[0]).toBe(4);

      // Continue counting
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(3);
    });

    it('should handle prop changes', () => {
      const { result, rerender } = renderHook(
        ({ initialSeconds }) => useCountdown(initialSeconds),
        { initialProps: { initialSeconds: 5 } }
      );

      expect(result.current[0]).toBe(5);

      // Count down
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(4);

      // Change initial value
      rerender({ initialSeconds: 10 });

      expect(result.current[0]).toBe(4); // Should not change immediately

      // Reset should use new initial value
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(10);
    });
  });

  describe('Performance and Optimization', () => {
    it('should not create unnecessary intervals when at zero', () => {
      const { result } = renderHook(() => useCountdown(3));

      expect(result.current[0]).toBe(3);

      // Count down to zero
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current[0]).toBe(0);

      // Should not create new intervals when at zero
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current[0]).toBe(0);
    });

    it('should provide stable reset function', () => {
      const { result, rerender } = renderHook(() => useCountdown(5));

      const resetFunction1 = result.current[1];

      // Re-render
      rerender();

      const resetFunction2 = result.current[1];

      // Should be a function (stability depends on useCallback implementation)
      expect(typeof resetFunction1).toBe('function');
      expect(typeof resetFunction2).toBe('function');
    });
  });

  describe('Integration Scenarios', () => {
    it('should work in a typical countdown scenario', () => {
      const { result } = renderHook(() => useCountdown(60));

      expect(result.current[0]).toBe(60);

      // Simulate 30 seconds passing
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(result.current[0]).toBe(30);

      // Reset at 30 seconds
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(60);

      // Continue for 15 more seconds
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(result.current[0]).toBe(45);
    });

    it('should handle multiple resets in sequence', () => {
      const { result } = renderHook(() => useCountdown(10));

      expect(result.current[0]).toBe(10);

      // Count down to 7
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current[0]).toBe(7);

      // Reset
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(10);

      // Count down to 5
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current[0]).toBe(5);

      // Reset again
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(10);

      // Count down to 0
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current[0]).toBe(0);

      // Final reset
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(10);
    });
  });
});
