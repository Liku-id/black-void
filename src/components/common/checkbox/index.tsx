'use client';

import React from 'react';
import { cn } from '@/utils/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | (() => void);
  id?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  /**
   * @default 'style1'
   * @description 'style1' for custom SVG checkmark with label, 'style2' for simple checkmark using CSS pseudo-element
   */
  variant?: 'style1' | 'style2';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  className = '',
  disabled = false,
  children,
  variant = 'style1',
  ...rest
}) => {
  // Common props for both variants
  const commonProps = {
    type: 'checkbox',
    checked,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        // Handle both signature types
        if (onChange.length === 0) {
          (onChange as () => void)();
        } else {
          onChange(e);
        }
      }
    },
    disabled,
    ...rest,
  };

  if (variant === 'style1') {
    return (
      <label
        className={`inline-flex cursor-pointer items-center gap-2 ${className}`}
        htmlFor={id}
      >
        <span
          className="relative flex items-center"
          style={{ marginRight: 12 }}
        >
          <input
            {...commonProps}
            id={id}
            className="peer h-6 w-6 appearance-none rounded-none border border-white bg-black transition-colors checked:border-green-500 checked:bg-green-500 focus:outline-none"
          />
          {/* Custom checkmark, center, only show if checked */}
          {checked && (
            <span className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="11"
                viewBox="0 0 13 11"
                fill="none"
              >
                <path d="M1 5L5 9L12 1" stroke="white" strokeWidth="2" />
              </svg>
            </span>
          )}
        </span>
        {children}
      </label>
    );
  }

  // Variant style2
  return (
    <label className="inline-flex cursor-pointer gap-2">
      <input
        {...commonProps}
        className={cn(
          `
          appearance-none 
          h-4 w-4 
          border border-white 
          bg-black 
          cursor-pointer 
          flex items-center justify-center
          before:content-['✓'] 
          before:text-md
          before:text-white 
          before:opacity-0 
          checked:before:opacity-100
        `,
          className
        )}
      />
      {children}
    </label>
  );
};
