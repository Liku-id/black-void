import { render, screen, fireEvent } from '@testing-library/react';
import { DateField } from './index';
import { useForm, FormProvider } from 'react-hook-form';

// Wrappers
const FormWrapper = ({ children }: any) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('DateField', () => {
  it('renders input type date', () => {
    render(<DateField value="2023-01-01" onChange={jest.fn()} />);
    // Checking if input type is date
    // getByDisplayValue might fail if date format differs.
    const input = screen.getByDisplayValue('2023-01-01');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });

  it('handles change in controlled mode', () => {
    const handleChange = jest.fn();
    render(<DateField value="" onChange={handleChange} />);

    const input = document.querySelector('input[type="date"]');
    fireEvent.change(input!, { target: { value: '2023-12-31' } });

    expect(handleChange).toHaveBeenCalledWith('2023-12-31');
  });

  it('works with react-hook-form', () => {
    render(
      <FormWrapper>
        <DateField name="testDate" />
      </FormWrapper>
    );

    const input = document.querySelector('input[name="testDate"]');
    expect(input).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<DateField value="" onChange={jest.fn()} disabled />);
    const input = document.querySelector('input[type="date"]');
    expect(input).toBeDisabled();
  });
});
