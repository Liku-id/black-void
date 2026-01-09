import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './index';

describe('Checkbox', () => {
  it('renders children', () => {
    render(
      <Checkbox checked={false} readOnly>
        Label Text
      </Checkbox>
    );
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('renders as checked when checked=true', () => {
    render(
      <Checkbox checked={true} readOnly>
        Checked
      </Checkbox>
    );
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('renders as unchecked when checked=false', () => {
    render(
      <Checkbox checked={false} readOnly>
        Unchecked
      </Checkbox>
    );
    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('calls onChange when clicked and not disabled (onChange has e)', () => {
    const handleChange = jest.fn();
    render(
      <Checkbox checked={false} onChange={handleChange}>
        Click me
      </Checkbox>
    );
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  it('calls onChange when clicked and onChange is () => void', () => {
    const handleChange = jest.fn();
    render(
      <Checkbox checked={false} onChange={handleChange as any}>
        Click me
      </Checkbox>
    );
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  it('does not call onChange if disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Checkbox checked={false} disabled onChange={handleChange}>
        Disabled
      </Checkbox>
    );
    const input = screen.getByRole('checkbox');
    await user.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders SVG checkmark when checked', () => {
    render(
      <Checkbox checked={true} variant="black">
        Checkmark visible
      </Checkbox>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
    // The checkmark is an image in a span, we can check for the alt text
    expect(screen.getByAltText('checked')).toBeInTheDocument();
  });

  it('renders white variant', () => {
    render(
      <Checkbox checked={true} variant="white">
        White Variant
      </Checkbox>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('checkbox')).toHaveClass('bg-white');
  });
});
