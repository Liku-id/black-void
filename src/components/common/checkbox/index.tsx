'use client';

import React from 'react';
import checkedSvg from '@/assets/icons/checked.svg';
import Image from 'next/image';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | (() => void);
  id?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'black' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  className = '',
  disabled = false,
  children,
  variant = 'black',
  size = 'md',
  ...rest
}) => {
  const baseClass =
    variant === 'white' ? 'border-black bg-white' : 'border-white bg-black';

  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

  return (
    <label
      className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      htmlFor={id}>
      <span className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          id={id}
          disabled={disabled}
          className={`peer ${sizeClass} appearance-none rounded-none border ${baseClass} transition-colors checked:border-green-500 checked:bg-green-500 focus:outline-none ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}
          {...rest}
        />
        {/* Custom checkmark, center, only show if checked */}
        {checked && (
          <span className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <Image src={checkedSvg} alt="checked" width={15} height={15} />
          </span>
        )}
      </span>
      {children}
    </label>
  );
};

export default Checkbox;
