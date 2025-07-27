import React, { forwardRef } from 'react';

/**
 * Box Component
 *
 * @example
 * // Basic usage
 * <Box className="p-4 bg-blue-100">
 *   <p>Content inside box</p>
 * </Box>
 *
 * @example
 * // With click handler
 * <Box onClick={() => console.log('Box clicked')}>
 *   Clickable content
 * </Box>
 */
interface BoxProps {
  children?: React.ReactNode;
  id?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  tabIndex?: number;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...rest }, ref) => {
    return (
      <div ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

Box.displayName = 'Box';
