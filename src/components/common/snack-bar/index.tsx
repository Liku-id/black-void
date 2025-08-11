'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@/components';

export type SnackVariant = 'error' | 'success' | 'warning' | 'info';

interface SnackBannerProps {
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

const SnackBanner: React.FC<SnackBannerProps> = ({
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

  // Handle show/hide logic with proper animations
  useEffect(() => {
    if (show && !shouldRender) {
      // Show: First render in DOM, then animate
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      // Auto hide if enabled
      if (autoHide && autoHideDelay > 0) {
        const timeout = setTimeout(() => {
          handleHide();
        }, autoHideDelay);

        return () => clearTimeout(timeout);
      }
    } else if (!show && shouldRender) {
      // Hide: First animate out, then remove from DOM
      handleHide();
    }
  }, [show, shouldRender, autoHide, autoHideDelay]);

  const handleHide = () => {
    setIsVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setShouldRender(false);
      onHide?.();
    }, 500);
  };

  // Don't render if not needed
  if (!shouldRender) return null;

  const positionClasses = position === 'top' 
    ? 'top-5' 
    : 'bottom-5';

  return (
    <Box
      className={`
        fixed ${positionClasses} left-1/2 z-[9999] 
        -translate-x-1/2 rounded-md px-5 py-3 
        shadow-lg min-w-[300px] max-w-[90vw] 
        transition-all duration-500 ease-in-out
        ${variantStyles[variant]}
        ${isVisible 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : `opacity-0 transform ${position === 'top' ? '-translate-y-3' : 'translate-y-3'} scale-95`
        }
        ${className}
      `}
    >
      <Box className="flex items-center justify-between gap-3">
        <span className="flex-1 text-sm font-medium">
          {text}
        </span>
        
        {showCloseButton && (
          <button 
            onClick={handleHide}
            className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
            aria-label="Close notification"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </Box>
    </Box>
  );
};

export default SnackBanner;