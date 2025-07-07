import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { TextField } from './index';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Test wrapper for form context
const TestFormWrapper = ({ children, defaultValues = {} }: { children: React.ReactNode; defaultValues?: any }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('TextField', () => {
  describe('Controlled Mode', () => {
    it('renders with placeholder', () => {
      render(<TextField placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('handles value and onChange', () => {
      const mockOnChange = jest.fn();
      render(<TextField value="test" onChange={mockOnChange} />);
      
      const input = screen.getByDisplayValue('test');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('new value');
    });

    it('renders start icon when provided', () => {
      render(<TextField startIcon="/icons/user.svg" />);
      expect(screen.getByAltText('Start icon')).toBeInTheDocument();
    });

    it('renders end icon when provided', () => {
      render(<TextField endIcon="/icons/search.svg" />);
      expect(screen.getByAltText('End icon')).toBeInTheDocument();
    });

    it('calls onStartIconClick when start icon is clicked', () => {
      const mockClick = jest.fn();
      render(<TextField startIcon="/icons/user.svg" onStartIconClick={mockClick} />);
      
      const startIcon = screen.getByAltText('Start icon');
      fireEvent.click(startIcon);
      
      expect(mockClick).toHaveBeenCalled();
    });

    it('calls onEndIconClick when end icon is clicked', () => {
      const mockClick = jest.fn();
      render(<TextField endIcon="/icons/search.svg" onEndIconClick={mockClick} />);
      
      const endIcon = screen.getByAltText('End icon');
      fireEvent.click(endIcon);
      
      expect(mockClick).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<TextField className="custom-class" />);
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Form Mode', () => {
    it('renders in form mode when name is provided', () => {
      render(
        <TestFormWrapper defaultValues={{ email: '' }}>
          <TextField name="email" placeholder="Email" />
        </TestFormWrapper>
      );
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    it('handles form field value changes', () => {
      const TestComponent = () => {
        const methods = useForm({ defaultValues: { email: '' } });
        return (
          <FormProvider {...methods}>
            <TextField name="email" placeholder="Email" />
          </FormProvider>
        );
      };

      render(<TestComponent />);
      
      const input = screen.getByPlaceholderText('Email');
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      
      expect(input).toHaveValue('test@example.com');
    });

    it('shows error styling when field has error', () => {
      const TestComponent = () => {
        const methods = useForm({ 
          defaultValues: { email: '' },
          mode: 'onChange'
        });
        
        // Trigger validation error
        methods.setError('email', { type: 'required', message: 'Required' });
        
        return (
          <FormProvider {...methods}>
            <TextField name="email" placeholder="Email" />
          </FormProvider>
        );
      };

      render(<TestComponent />);
      
      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('Accessibility', () => {
    it('has proper role', () => {
      render(<TextField placeholder="Enter text" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has proper alt text for icons', () => {
      render(<TextField startIcon="/icons/user.svg" endIcon="/icons/search.svg" />);
      expect(screen.getByAltText('Start icon')).toBeInTheDocument();
      expect(screen.getByAltText('End icon')).toBeInTheDocument();
    });
  });
}); 