'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box } from '@/components';
import { cn } from '@/utils/utils';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { Typography } from '../typography';
import calendarIcon from '@/assets/icons/calendar-2.svg';

interface DateFieldProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  rules?: RegisterOptions;
  disabled?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
  id,
  name,
  value,
  className = '',
  onChange,
  rules,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerClass = cn(
    `flex items-center h-10 border border-black px-3 transition-all duration-200 outline-none`,
    isFocused
      ? 'border-black shadow-[4px_4px_0px_0px_#FFFF] translate-x-[-2px] translate-y-[-2px]'
      : '',
    className
  );

  const inputClass = (disabled?: boolean) =>
    cn(
      'flex-1 border-0 bg-transparent text-black h-full p-0 focus:outline-none w-full cursor-pointer',
      disabled && 'text-gray-400 cursor-not-allowed'
    );

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
              className={`flex h-11 items-center px-2 ${
                disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'
              } ${
                isFocused
                  ? `translate-x-[-2px] translate-y-[-2px] border shadow-[4px_4px_0px_0px_#FFFF] ${fieldState.error ? 'border-danger' : 'border-black'}`
                  : `border ${fieldState.error ? 'border-danger' : 'border-black'}`
              }`}>
              <Image
                src={calendarIcon}
                alt="Calendar"
                width={20}
                height={20}
                className="mr-2"
              />
              <input
                id={id}
                {...field}
                value={field.value ?? ''}
                type="date"
                data-slot="input"
                className={cn(
                  inputClass(disabled),
                  fieldState.error && 'border-danger'
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
                disabled={disabled}
              />
            </Box>

            {fieldState.error && (
              <Typography size={12} className="text-danger mt-1">
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
      <Image
        src={calendarIcon}
        alt="Calendar"
        width={20}
        height={20}
        className="mr-2"
      />
      <input
        type="date"
        data-slot="input"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className={inputClass(disabled)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
        disabled={disabled}
      />
    </Box>
  );
};
