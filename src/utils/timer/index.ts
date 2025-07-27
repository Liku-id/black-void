import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useCountdown - A reusable countdown timer hook
 * @param initialSeconds Number of seconds to count down from
 * @returns [secondsLeft, resetCountdown]
 */
export function useCountdown(initialSeconds: number): [number, () => void] {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset function
  const resetCountdown = useCallback(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secondsLeft]);

  return [secondsLeft, resetCountdown];
}
