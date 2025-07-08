import React from 'react';
import { cn } from '@/lib/utils';

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
    <div
      className={cn(
        'mx-auto w-full max-w-[1140px] px-4 md:px-6 lg:px-8',
        className
      )}
      onClick={onClick}>
      {children}
    </div>
  );
};
