import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputFile } from './index';
import { useForm, FormProvider } from 'react-hook-form';

const FormWrapper = ({ children }: any) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('InputFile', () => {
  it('renders correctly', () => {
    render(
      <FormWrapper>
        <InputFile name="testFile" placeholder="Upload here" />
      </FormWrapper>
    );

    expect(screen.getByPlaceholderText('Upload here')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(
      <FormWrapper>
        <InputFile name="testFile" />
      </FormWrapper>
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    fireEvent.change(fileInput);

    // Verify file input has files
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files![0]).toBe(file);
  });

  it('disables input', () => {
    render(
      <FormWrapper>
        <InputFile name="testFile" disabled />
      </FormWrapper>
    );

    const textInput = screen.getByPlaceholderText('Choose File');
    expect(textInput).toBeDisabled();
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeDisabled();
  });
});
