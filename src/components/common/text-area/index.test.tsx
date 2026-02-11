import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './index';
import { useForm, FormProvider } from 'react-hook-form';

const FormWrapper = ({ children }: any) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('TextArea', () => {
  it('renders placeholder', () => {
    render(<TextArea placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('handles changes', () => {
    const handleChange = jest.fn();
    render(<TextArea onChange={handleChange} />);

    const textarea = document.querySelector('textarea');
    fireEvent.change(textarea!, { target: { value: 'New text' } });

    expect(handleChange).toHaveBeenCalledWith('New text');
  });

  it('integrates with react-hook-form', () => {
    render(
      <FormWrapper>
        <TextArea name="description" placeholder="Desc" />
      </FormWrapper>
    );
    expect(screen.getByPlaceholderText('Desc')).toBeInTheDocument();
  });
});
