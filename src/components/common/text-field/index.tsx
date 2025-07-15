'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box } from '@/components';
import { cn } from '@/utils/utils';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { Typography } from '../typography';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';

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
  onPasswordChange?: (value: string) => void;
  onCountryCodeChange?: (value: string) => void;
  rules?: RegisterOptions;
  isPhoneNumber?: boolean;
  countryCodes?: { label: string; value: string }[];
  selectedCountryCode?: string;
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
  onCountryCodeChange,
  rules,
  isPhoneNumber = false,
  countryCodes = [],
  selectedCountryCode = '',
  onPasswordChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { control } = useFormContext();
  const isControlledByForm = Boolean(name && control);

  const containerClass = cn(
    `flex items-center h-10 border border-black bg-white px-3 transition-all duration-200 outline-none ${isFocused ? 'border-black shadow-[4px_4px_0px_0px_#FFFF] translate-x-[-2px] translate-y-[-2px]' : ''}`,
    className
  );
  const inputClass =
    'flex-1 border-0 bg-transparent text-black placeholder:text-muted h-full p-0 outline-none focus:outline-none focus:ring-0';

  const renderCountrySelect = () =>
    isPhoneNumber && countryCodes.length > 0 ? (
      <div className="relative mr-2 h-full bg-[#DADADA]">
        <select
          className="appearance-none pl-6 pr-2 h-full bg-transparent text-black outline-none"
          value={selectedCountryCode}
          onChange={(e) => onCountryCodeChange?.(e.target.value)}
        >
          {countryCodes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image
            src={accordionArrow}
            alt="dropdown code"
            width={24}
            height={24}
            className="h-6 w-6 transition-transform duration-200"
          />
        </span>
      </div>
    ) : null;

  if (isControlledByForm) {
    return (
      <Controller
        name={name || ''}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <Box className={className}>
            <Box
              className={`flex h-10 items-center bg-white transition-all duration-200 outline-none ${isPhoneNumber ? 'pr-3' : 'px-3'} ${
                isFocused
                  ? `translate-x-[-2px] translate-y-[-2px] border shadow-[4px_4px_0px_0px_#FFFF] ${fieldState.error ? 'border-danger' : 'border-black'}`
                  : `border ${fieldState.error ? 'border-danger' : 'border-black'}`
              }`}
            >
              {renderCountrySelect()}
              <input
                id={id}
                {...field}
                value={field.value ?? ''}
                type={type}
                placeholder={placeholder}
                className={cn(inputClass, fieldState.error && 'border-danger')}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  field.onChange(e);
                  onPasswordChange?.(e.target.value);
                }}
                {...props}
              />
              {endIcon && (
                <Box
                  className="ml-2 flex cursor-pointer items-center"
                  onClick={onEndIconClick}
                >
                  <Image
                    src={endIcon}
                    alt="End icon"
                    width={24}
                    height={24}
                    className="h-5 w-5 md:h-6 md:w-6"
                  />
                </Box>
              )}
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
      {renderCountrySelect()}
      {startIcon && (
        <span className="flex items-center" onClick={onStartIconClick}>
          <Image
            src={startIcon}
            alt="Start icon"
            width={24}
            height={24}
            className="h-5 w-5 md:h-6 md:w-6"
          />
        </span>
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
          <Image
            src={endIcon}
            alt="End icon"
            width={24}
            height={24}
            className="h-5 w-5 md:h-6 md:w-6"
          />
        </Box>
      )}
    </Box>
  );
};
