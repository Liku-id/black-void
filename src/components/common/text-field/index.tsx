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
  onCountryCodeChange?: (value: string) => void;
  rules?: RegisterOptions;
  countryCodes?: { label: string; value: string }[];
  selectedCountryCode?: string;
  disabled?: boolean;
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
  countryCodes = [],
  selectedCountryCode = '',
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
      'flex-1 border-0 bg-transparent text-black placeholder:text-muted h-full p-0 focus:outline-none w-full',
      disabled && 'text-gray-400 cursor-not-allowed'
    );

  const renderCountrySelect = () =>
    name?.includes('phoneNumber') && countryCodes.length > 0 ? (
      <Box className="relative mr-2 h-full bg-[#DADADA]">
        <select
          id="phone_number_code_select"
          className="h-full appearance-none bg-transparent pr-2 pl-6 text-black outline-none"
          value={selectedCountryCode}
          onChange={e => onCountryCodeChange?.(e.target.value)}>
          {countryCodes.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2">
          <Image
            src={accordionArrow}
            alt="dropdown code"
            width={24}
            height={24}
            className="h-6 w-6 transition-transform duration-200"
          />
        </span>
      </Box>
    ) : null;

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
              className={`flex h-11 items-center ${name?.includes('phoneNumber') ? 'pr-3' : 'px-2'} ${
                disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'
              } ${
                isFocused
                  ? `translate-x-[-2px] translate-y-[-2px] border shadow-[4px_4px_0px_0px_#FFFF] ${fieldState.error ? 'border-danger' : 'border-black'}`
                  : `border ${fieldState.error ? 'border-danger' : 'border-black'}`
              }`}>
              {renderCountrySelect()}
              {startIcon && (
                <Box
                  className="mr-2 flex cursor-pointer items-center"
                  onClick={onStartIconClick}>
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
                  inputClass(disabled),
                  fieldState.error && 'border-danger'
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
                disabled={disabled}
              />
              {endIcon && (
                <Box
                  data-testid="endAdornment"
                  className="ml-2 flex cursor-pointer items-center"
                  onClick={onEndIconClick}>
                  <Image src={endIcon} alt="End icon" width={20} height={20} />
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
        onChange={e => onChange?.(e.target.value)}
        className={inputClass(disabled)}
        {...props}
        disabled={disabled}
      />
      {endIcon && (
        <Box
          className="ml-2 flex cursor-pointer items-center"
          onClick={onEndIconClick}>
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
