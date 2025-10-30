import React from 'react';
import { cn } from '@/utils/utils';

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | (() => void);
  id?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  name?: string;
}

export const Radio: React.FC<RadioProps> = ({
  checked,
  onChange,
  id,
  className = '',
  disabled = false,
  children,
  name,
  ...rest
}) => {
  return (
    <label
      className={cn('inline-flex cursor-pointer items-center', className)}
      htmlFor={id}>
      <span className="relative mr-3 flex items-center">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          id={id}
          name={name}
          disabled={disabled}
          className="peer border-black h-4 w-4 cursor-pointer appearance-none rounded-full border bg-white transition-colors focus:outline-none"
          {...rest}
        />
        {/* Custom radio indicator */}
        <span
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center',
            checked ? 'bg-black h-2.5 w-2.5 rounded-full' : 'hidden'
          )}
        />
      </span>
      {children}
    </label>
  );
};

export default Radio;
