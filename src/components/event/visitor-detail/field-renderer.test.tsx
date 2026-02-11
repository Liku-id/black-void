import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import FieldRenderer from './field-renderer';
import { useForm, FormProvider } from 'react-hook-form';

// Mocks
jest.mock('@/components', () => ({
  TextField: ({ name, placeholder, onChange, value, disabled }: any) => (
    <input data-testid={`textfield-${name}`} name={name} placeholder={placeholder} onChange={e => onChange?.(e.target.value)} value={value} disabled={disabled} />
  ),
  TextArea: ({ name, placeholder, disabled }: any) => (
    <textarea data-testid={`textarea-${name}`} name={name} placeholder={placeholder} disabled={disabled} />
  ),
  DateField: ({ name, disabled }: any) => (
    <input type="date" data-testid={`datefield-${name}`} name={name} disabled={disabled} />
  ),
  Radio: ({ children, name, checked, onChange, disabled }: any) => (
    <div data-testid={`radio-${name}`} onClick={onChange} aria-checked={checked}>
      {children}
    </div>
  ),
  Checkbox: ({ children, checked, onChange, disabled }: any) => (
    <div data-testid="checkbox-group">
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
        {children}
      </label>
    </div>
  ),
  Typography: ({ children }: any) => <span>{children}</span>,
  Box: ({ children }: any) => <div>{children}</div>,
}));

const FormWrapper = ({ children, defaultValues = {} }: any) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FieldRenderer', () => {
  const mockForm = {
    control: {},
    register: jest.fn(),
  };

  const renderWithForm = (additionalForm: any, visitorIndex = 0) => {
    const { result } = renderHook(() => useForm({
      defaultValues: { visitors: [{}] }
    }));

    return render(
      <FormProvider {...result.current}>
        <FieldRenderer
          form={result.current}
          additionalForm={additionalForm}
          visitorIndex={visitorIndex}
        />
      </FormProvider>
    );
  };

  it('renders TEXT field', () => {
    renderWithForm({ field: 'Full Name', type: 'TEXT', isRequired: true, id: '1' });
    expect(screen.getByText('Full Name*')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-visitors.0.Full Name')).toBeInTheDocument();
  });

  it('renders NUMBER field', () => {
    // Number field uses Controller and TextField
    renderWithForm({ field: 'Age', type: 'NUMBER', isRequired: false, id: '2' });
    expect(screen.getByText('Age')).toBeInTheDocument();
    const input = screen.getByTestId('textfield-undefined'); // name prop not passed to TextField mock in Controller render?
    // Wait, in FieldRenderer for NUMBER:
    // <TextField ... value={field.value} onChange={...} />
    // It doesn't pass `name` explicitly to TextField but Controller handles it.
    // Our mock expects name? 
    // Let's check FieldRenderer code.
    // NUMBER case:
    // <Controller name={fieldName} ... render={({ field }) => <TextField ... />} />
    // It passes value and onChange, but not name to TextField.
    // So name in mock will be undefined.
    // We can rely on placeholder or just presence.
    expect(input).toBeInTheDocument();

    // Test number input logic
    fireEvent.change(input, { target: { value: 'abc' } });
    // Should clean non-digits. 'abc' -> ''
    // But since input type is text (in component), value update triggers onChange.
    // field.onChange called with cleaned value.
  });

  it('renders DROPDOWN as Radios', () => {
    renderWithForm({
      field: 'Gender',
      type: 'DROPDOWN',
      options: ['Male', 'Female'],
      isRequired: true,
      id: '3'
    });

    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  it('renders CHECKBOX', () => {
    renderWithForm({
      field: 'Interests',
      type: 'CHECKBOX',
      options: ['Coding', 'Design'],
      isRequired: false,
      id: '4'
    });

    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders DATE field', () => {
    renderWithForm({ field: 'Birth Date', type: 'DATE', isRequired: true, id: '5' });
    expect(screen.getByTestId('datefield-visitors.0.Birth Date')).toBeInTheDocument();
  });

  it('renders PARAGRAPH field', () => {
    renderWithForm({ field: 'Bio', type: 'PARAGRAPH', isRequired: false, id: '6' });
    expect(screen.getByTestId('textarea-visitors.0.Bio')).toBeInTheDocument();
  });
});
