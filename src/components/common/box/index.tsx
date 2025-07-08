import React from 'react';

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
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Box: React.FC<BoxProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
