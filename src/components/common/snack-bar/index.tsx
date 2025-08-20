'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@/components';

export type SnackVariant = 'error' | 'success' | 'warning' | 'info';

interface SnackBarProps {
  show: boolean;
  onHide?: () => void;
  text: string;
  variant?: SnackVariant;
  autoHide?: boolean;
  autoHideDelay?: number;
  position?: 'top' | 'bottom';
  showCloseButton?: boolean;
  className?: string;
}

const variantStyles: Record<SnackVariant, string> = {
  error: 'bg-danger text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
};

const SnackBar: React.FC<SnackBarProps> = ({
  show,
  onHide,
  text,
  variant = 'error',
  autoHide = true,
  autoHideDelay = 5000,
  position = 'top',
  showCloseButton = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (show) {
      // mount then enter animation (double rAF to ensure the transition class is applied)
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else if (shouldRender) {
      // exit animation then unmount
      setIsVisible(false);
      const t = setTimeout(() => {
        setShouldRender(false);
        onHide?.(); // optional, if you want to synchronize the parent state
      }, 500);
      return () => clearTimeout(t);
    }
  }, [show, shouldRender, onHide]);

  // separate auto-hide timer to prevent it from being "cleared" by re-rendering
  useEffect(() => {
    // reset the timer every time the content reappears / the text changes
    if (show && autoHide && autoHideDelay > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // triggers hide the same as clicking close
        setIsVisible(false);
        setTimeout(() => {
          setShouldRender(false);
          onHide?.();
        }, 500);
      }, autoHideDelay);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    // Add `text` so the timer restarts if the message changes while it's still displayed
  }, [show, text, autoHide, autoHideDelay, onHide]);

  if (!shouldRender) return null;

  const positionClasses = position === 'top' ? 'top-5' : 'bottom-5';

  const handleManualClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onHide?.();
    }, 500);
  };

  return (
    <Box
      className={`fixed ${positionClasses} left-1/2 z-[9999] max-w-[90vw] min-w-[300px] -translate-x-1/2 rounded-md px-5 py-3 shadow-lg transition-all duration-500 ease-in-out ${variantStyles[variant]} ${
        isVisible
          ? 'translate-y-0 scale-100 transform opacity-100'
          : `scale-95 transform opacity-0 ${position === 'top' ? '-translate-y-3' : 'translate-y-3'}`
      } ${className} `}>
      <Box className="flex items-center justify-between gap-3">
        <span className="flex-1 text-sm font-medium">{text}</span>
        {showCloseButton && (
          <button
            onClick={handleManualClose}
            className="flex-shrink-0 text-current transition-opacity hover:opacity-70"
            aria-label="Close notification">
            <svg
              className="h-4 w-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </Box>
    </Box>
  );
};

export default SnackBar;
