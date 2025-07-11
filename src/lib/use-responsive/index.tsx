'use client';
import { useEffect, useState } from 'react';

// Multi-breakpoint responsive hook (SSR-friendly)
export type BreakpointMap = Record<string, boolean>;

// Default Tailwind breakpoints
export const defaultBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive(
  breakpoints: Record<string, number> = defaultBreakpoints,
  initialViewport: BreakpointMap = {
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  }
) {
  const calculateViewport = () => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return initialViewport;
    return Object.keys(breakpoints).reduce((acc, key) => {
      acc[key] = window.matchMedia(
        `(min-width: ${breakpoints[key]}px)`
      ).matches;
      return acc;
    }, {} as BreakpointMap);
  };

  const [viewport, setViewport] = useState<BreakpointMap>(calculateViewport);

  useEffect(() => {
    const handleResize = () => setViewport(calculateViewport());
    if (typeof window !== 'undefined') {
      setViewport(calculateViewport());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [breakpoints]);

  return viewport;
}
