'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box } from '@/components/common/Box';
import { cn } from '@/lib/utils';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { Typography } from '../Typography';

interface TextFieldProps {
  id?: string;
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
  rules?: RegisterOptions;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
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
  rules,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerClass = cn(
    `flex items-center h-10 border border-black bg-white px-3 transition-all duration-200 outline-none ${isFocused ? 'border-black shadow-[4px_4px_0px_0px_#FFFF] translate-x-[-2px] translate-y-[-2px]' : ''}`,
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
        rules={rules}
        render={({ field, fieldState }) => (
          <Box className={className}>
            <Box
              className={`flex items-center h-10 bg-white px-3 transition-all duration-200 outline-none
                ${
                  isFocused
                    ? `border shadow-[4px_4px_0px_0px_#FFFF] translate-x-[-2px] translate-y-[-2px] ${fieldState.error ? 'border-[#F93A37]' : 'border-black'}`
                    : `border ${fieldState.error ? 'border-[#F93A37]' : 'border-black'}`
                }`}
            >
              {startIcon && (
                <Box
                  className="mr-2 flex cursor-pointer items-center"
                  onClick={onStartIconClick}
                >
                  <Image
                    src={startIcon}
                    alt="Start icon"
                    width={20}
                    height={20}
                  />
                </Box>
              )}
              <input
                id={id}
                {...field}
                value={field.value ?? ''}
                type={type}
                data-slot="input"
                placeholder={placeholder}
                className={cn(
                  inputClass,
                  fieldState.error && 'border-[#F93A37]'
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
              />
              {endIcon && (
                <Box
                  className="ml-2 flex cursor-pointer items-center"
                  onClick={onEndIconClick}
                >
                  <Image src={endIcon} alt="End icon" width={20} height={20} />
                </Box>
              )}
            </Box>

            {fieldState.error && (
              <Typography size={12} className="text-[#F93A37] mt-1">
                {fieldState.error.message}
              </Typography>
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
        <Box
          className="mr-2 flex cursor-pointer items-center"
          onClick={onStartIconClick}
        >
          <Image src={startIcon} alt="Start icon" width={20} height={20} />
        </Box>
      )}
      <input
        type={type}
        data-slot="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={inputClass}
        {...props}
      />
      {endIcon && (
        <Box
          className="ml-2 flex cursor-pointer items-center"
          onClick={onEndIconClick}
        >
          <Image src={endIcon} alt="End icon" width={20} height={20} />
        </Box>
      )}
    </Box>
  );
};
