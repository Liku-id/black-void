'use client';

import React from 'react';
import { cn } from '@/utils/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className,
  ...props
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={cn(
        `
        appearance-none 
        h-4 w-4 
        border border-white 
        bg-black 
        cursor-pointer 
        flex items-center justify-center
        before:content-['✓'] 
        before:text-sm 
        before:text-white 
        before:font-bold 
        before:opacity-0 
        checked:before:opacity-100
      `,
        className
      )}
      {...props}
    />
  );
};
