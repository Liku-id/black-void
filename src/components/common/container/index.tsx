import React from 'react';
import { cn } from '@/lib/utils';
import { Box } from '../box';

/**
 * @example
 * // Basic usage
 * <Container>
 *   <h1>Page content</h1>
 *   <p>Centered with responsive padding</p>
 * </Container>
 */

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <Box
      className={cn('mx-auto w-full max-w-[1140px]', className)}
      onClick={onClick}>
      {children}
    </Box>
  );
};
