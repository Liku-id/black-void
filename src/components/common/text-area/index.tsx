'use client';

import React, { useState } from 'react';
import { Box } from '@/components';
import { cn } from '@/utils/utils';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { Typography } from '../typography';

interface TextAreaProps {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  onChange?: (value: string) => void;
  rules?: RegisterOptions;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  value,
  placeholder,
  className = '',
  rows = 4,
  onChange,
  rules,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerClass = cn(
    `flex items-start h-auto border border-black px-3 py-2 transition-all duration-200 outline-none`,
    isFocused
      ? 'border-black shadow-[4px_4px_0px_0px_#FFFF] translate-x-[-2px] translate-y-[-2px]'
      : '',
    className
  );

  const textareaClass = (disabled?: boolean) =>
    cn(
      'flex-1 border-0 bg-transparent text-black placeholder:text-muted resize-none h-full p-0 focus:outline-none w-full min-h-[80px]',
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
              className={`flex h-auto min-h-[80px] items-start ${
                disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'
              } ${
                isFocused
                  ? `translate-x-[-2px] translate-y-[-2px] border shadow-[4px_4px_0px_0px_#FFFF] ${fieldState.error ? 'border-danger' : 'border-black'}`
                  : `border ${fieldState.error ? 'border-danger' : 'border-black'}`
              }`}>
              <textarea
                id={id}
                {...field}
                value={field.value ?? ''}
                data-slot="textarea"
                placeholder={placeholder}
                rows={rows}
                className={cn(
                  textareaClass(disabled),
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

  // Controlled textarea mode
  return (
    <Box className={containerClass}>
      <textarea
        data-slot="textarea"
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={e => onChange?.(e.target.value)}
        className={textareaClass(disabled)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
        disabled={disabled}
      />
    </Box>
  );
};
