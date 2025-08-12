import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center disabled:opacity-50 cursor-pointer transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-green text-white font-onest text-base font-bold',
        'outline-white':
          'border border-white text-white font-onest text-base font-bold bg-transparent hover:bg-white hover:text-black',
      },
      size: {
        default: 'h-9 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * @example
 * // With click handler
 * <Button onClick={() => alert('Clicked!')}>Click Me</Button>
 *
 * @example
 * // Disabled button
 * <Button disabled>Disabled</Button>
 */

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
