'use client';
import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, TextArea, DateField, Radio, Checkbox, Typography, Box } from '@/components';
import type { AdditionalForm } from '../types';

interface FieldRendererProps {
  form: any; // FormProvider form instance
  additionalForm: AdditionalForm;
  visitorIndex: number;
  disabled?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  form,
  additionalForm,
  visitorIndex,
  disabled = false,
}) => {
  const fieldName = `visitors.${visitorIndex}.${additionalForm.field}`;
  const isRequired = additionalForm.isRequired;

  const getValidationRules = () => {
    const rules: any = {};
    
    if (isRequired) {
      rules.required = `${additionalForm.field} is required`;
    }

    if (additionalForm.type === 'NUMBER') {
      rules.validate = (value: string) => {
        if (!value && !isRequired) return true;
        const trimmedValue = value?.trim() || '';
        if (!trimmedValue && !isRequired) return true;
        const numValue = Number(trimmedValue);
        return (!isNaN(numValue) && isFinite(numValue)) || `${additionalForm.field} must be a valid number`;
      };
    }

    return rules;
  };

  const renderField = () => {
    switch (additionalForm.type) {
      case 'TEXT':
        return (
          <TextField
            name={fieldName}
            placeholder=""
            rules={getValidationRules()}
            disabled={disabled}
          />
        );

      case 'NUMBER':
        return (
          <Controller
            name={fieldName}
            control={form.control}
            rules={getValidationRules()}
            render={({ field }) => (
              <TextField
                placeholder=""
                disabled={disabled}
                type="text"
                value={field.value ?? ''}
                onChange={(value) => {
                  const cleanedValue = value.replace(/[^\d.]/g, '').trim();
                  field.onChange(cleanedValue);
                }}
              />
            )}
          />
        );

      case 'DATE':
        return (
          <DateField
            name={fieldName}
            rules={getValidationRules()}
            disabled={disabled}
          />
        );

      case 'PARAGRAPH':
        return (
          <TextArea
            name={fieldName}
            placeholder=""
            rows={4}
            rules={getValidationRules()}
            disabled={disabled}
          />
        );

      case 'DROPDOWN':
        return (
          <Controller
            name={fieldName}
            control={form.control}
            rules={getValidationRules()}
            render={({ field, fieldState }) => (
              <Box className="space-y-2">
                <Box className="grid grid-cols-2 gap-3">
                  {additionalForm.options.map((option: string, optionIndex: number) => (
                    <Radio
                      key={optionIndex}
                      id={`${fieldName}_${optionIndex}`}
                      name={fieldName}
                      checked={field.value === option}
                      onChange={() => field.onChange(option)}
                      disabled={disabled}
                    >
                      <Typography 
                        type="body" 
                        size={14} 
                        color="text-dark"
                      >
                        {option}
                      </Typography>
                    </Radio>
                  ))}
                </Box>
                {fieldState.error && (
                  <Typography type="body" size={12} color="text-red">
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );

      case 'CHECKBOX':
        return (
          <Controller
            name={fieldName}
            control={form.control}
            rules={getValidationRules()}
            render={({ field, fieldState }) => (
              <Box className="space-y-2">
                <Box className="grid grid-cols-2 gap-4">
                  {additionalForm.options.map((option: string, optionIndex: number) => {
                    const currentValues = field.value || [];
                    const isChecked = currentValues.includes(option);
                    
                    return (
                      <Checkbox
                        key={optionIndex}
                        id={`${fieldName}_${optionIndex}`}
                        checked={isChecked}
                        onChange={(e) => {
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter((val: string) => val !== option);
                          field.onChange(newValues);
                        }}
                        disabled={disabled}
                      >
                        <Typography 
                          type="body" 
                          size={14} 
                          color="text-dark"
                        >
                          {option}
                        </Typography>
                      </Checkbox>
                    );
                  })}
                </Box>
                {fieldState.error && (
                  <Typography type="body" size={12} color="text-red">
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box className="w-full">
      {/* Question Label */}
      <Typography 
        type="body" 
        size={14} 
        color="text-black"
        className="mb-2"
      >
        {additionalForm.field}{isRequired ? '*' : ''}
      </Typography>
      
      {/* Field */}
      <Box className="mb-4">
        {renderField()}
      </Box>
      
      {/* Border */}
      <Box 
        className="mb-4 border-b border-muted w-full"
      />
    </Box>
  );
};

export default FieldRenderer;
