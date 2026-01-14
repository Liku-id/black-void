'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';
import { Box, Typography } from '@/components';
import { cn } from '@/utils/utils';
import uploadIcon from '@/assets/icons/upload.svg';

interface InputFileProps {
  name: string;
  placeholder?: string;
  className?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  accept?: string;
}

export const InputFile: React.FC<InputFileProps> = ({
  name,
  placeholder = 'Choose File',
  className,
  rules,
  disabled,
  accept,
}) => {
  const { control } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleBoxClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const inputClass = (disabled?: boolean) =>
    cn(
      'flex-1 border-0 bg-transparent text-black placeholder:text-muted h-full p-0 focus:outline-none w-full cursor-pointer',
      disabled && 'text-gray-400 cursor-not-allowed'
    );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, onBlur, ...field }, fieldState }) => {
        // value is expected to be a FileList or File object, or null/undefined
        const fileName = value instanceof FileList && value.length > 0
          ? value[0].name
          : value instanceof File
            ? value.name
            : '';

        const isError = !!fieldState.error;

        return (
          <Box className={className}>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept={accept}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onChange(e.target.files);
                }
              }}
              disabled={disabled}
            />

            <Box
              onClick={handleBoxClick}
              className={cn(
                "flex h-11 items-center px-2 transition-all duration-200 outline-none border cursor-pointer", // Base
                disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white',
                isFocused
                  ? `translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_0px_#FFFF] ${isError ? 'border-danger' : 'border-black'}`
                  : `${isError ? 'border-danger' : 'border-black'}`
              )}
            >
              <input
                type="text"
                readOnly
                value={fileName}
                placeholder={placeholder}
                className={inputClass(disabled)}
                onFocus={() => setIsFocused(true)}
                {...field}
                onBlur={(e) => {
                  setIsFocused(false);
                  onBlur();
                }}
                onChange={() => { }}
                disabled={disabled}
              />

              <Box className="ml-2 flex items-center pointer-events-none">
                <Image src={uploadIcon} alt="Upload" width={20} height={20} />
              </Box>
            </Box>

            {fieldState.error && (
              <Typography size={12} className="text-danger mt-1">
                {fieldState.error.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};