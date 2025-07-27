'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@/components';
import Image from 'next/image';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  name: string;
  value?: string | number;
  onChange?: (name: string, value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  rules?: RegisterOptions;
}

export const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  error,
  rules,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  // Jika ada name, otomatis integrasi dengan react-hook-form
  if (name) {
    const { control } = useFormContext();
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <Box className={`relative ${className}`} ref={ref}>
            <button
              type="button"
              className={`flex w-full items-center justify-between border bg-white px-3 py-2 ${disabled ? 'bg-gray text-gray cursor-not-allowed' : 'text-black'} ${fieldState.error ? 'border-red' : 'border-black'}`}
              onClick={() => !disabled && setOpen(o => !o)}
              disabled={disabled}
              tabIndex={0}>
              <span className={field.value ? 'text-black' : 'text-muted'}>
                {options.find(opt => opt.value === field.value)?.label ||
                  placeholder}
              </span>
              <span className="-mr-2 flex items-center">
                <Image
                  src={accordionArrow}
                  alt="arrow"
                  width={24}
                  height={24}
                  className={open ? 'rotate-180' : ''}
                />
              </span>
            </button>
            {open && !disabled && (
              <Box className="absolute z-10 mt-1 w-full border bg-white">
                {options.map(opt => (
                  <Box
                    key={opt.value}
                    className={`cursor-pointer px-3 py-2 ${field.value === opt.value ? 'bg-gray font-semibold' : 'hover:bg-gray'}`}
                    onClick={() => {
                      field.onChange(opt.value);
                      setOpen(false);
                    }}
                    tabIndex={0}>
                    {opt.label}
                  </Box>
                ))}
              </Box>
            )}
            {fieldState.error && (
              <span className="text-red mt-1 text-xs">
                {fieldState.error.message}
              </span>
            )}
          </Box>
        )}
      />
    );
  }

  // Fallback: controlled mode (bukan react-hook-form)
  return (
    <Box className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={`flex w-full items-center justify-between border bg-white px-3 py-2 ${disabled ? 'bg-gray text-gray cursor-not-allowed' : 'text-black'} ${error ? 'border-red' : 'border-black'}`}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        tabIndex={0}>
        <span className={selectedOption ? 'text-black' : 'text-muted'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="-mr-2 flex items-center">
          <Image
            src={accordionArrow}
            alt="arrow"
            width={24}
            height={24}
            className={open ? 'rotate-180' : ''}
          />
        </span>
      </button>
      {open && !disabled && (
        <Box className="absolute z-10 mt-1 w-full border bg-white">
          {options.map(opt => (
            <Box
              key={opt.value}
              className={`cursor-pointer px-3 py-2 ${value === opt.value ? 'bg-gray font-semibold' : 'hover:bg-gray'}`}
              onClick={() => {
                if (onChange) onChange(name, opt.value);
                setOpen(false);
              }}
              tabIndex={0}>
              {opt.label}
            </Box>
          ))}
        </Box>
      )}
      {error && <span className="text-red mt-1 text-xs">{error}</span>}
    </Box>
  );
};
