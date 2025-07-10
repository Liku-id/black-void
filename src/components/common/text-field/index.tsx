'use client';

import React from 'react';
import Image from 'next/image';
import { Box } from '@/components';
import { cn } from '@/lib/utils';
import { useFormContext, Controller } from 'react-hook-form';

interface TextFieldProps {
  name?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  startIcon?: string;
  endIcon?: string;
  onStartIconClick?: () => void;
  onEndIconClick?: () => void;
  onChange?: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  type = 'text',
  value,
  placeholder,
  className = '',
  startIcon,
  endIcon,
  onStartIconClick,
  onEndIconClick,
  onChange,
  ...props
}) => {
  const containerClass = cn(
    'flex items-center h-10 border border-black bg-white px-3 gap-2',
    className
  );
  const inputClass =
    'flex-1 border-0 bg-transparent text-black placeholder:text-black h-full p-0 outline-none focus:outline-none focus:ring-0';

  // Form field mode with React Hook Form
  if (name) {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Box className={containerClass}>
            {startIcon && (
              <span className="flex items-center">
                <Image src={startIcon} alt="Start icon" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
              </span>
            )}
            <input
              {...field}
              type={type}
              data-slot="input"
              placeholder={placeholder}
              className={cn(inputClass, fieldState.error && 'border-red-500')}
              {...props}
            />
            {endIcon && (
              <Box
                className="ml-2 flex cursor-pointer items-center"
                onClick={onEndIconClick}>
                <Image src={endIcon} alt="End icon" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
              </Box>
            )}
          </Box>
        )}
      />
    );
  }

  // Controlled input mode
  return (
    <Box className={containerClass}>
      {startIcon && (
        <span className="flex items-center" onClick={onStartIconClick}>
          <Image src={startIcon} alt="Start icon" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className={inputClass}
        {...props}
      />
      {endIcon && (
        <Box
          className="ml-2 flex cursor-pointer items-center"
          onClick={onEndIconClick}>
          <Image src={endIcon} alt="End icon" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
        </Box>
      )}
    </Box>
  );
};
