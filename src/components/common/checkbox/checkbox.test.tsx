import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './index';

describe('Checkbox', () => {
  it('renders children', () => {
    render(<Checkbox checked={false}>Label Text</Checkbox>);
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('renders as checked when checked=true', () => {
    render(<Checkbox checked={true}>Checked</Checkbox>);
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('renders as unchecked when checked=false', () => {
    render(<Checkbox checked={false}>Unchecked</Checkbox>);
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

  it('does not call onChange if disabled', () => {
    const handleChange = jest.fn();
    render(
      <Checkbox checked={false} disabled onChange={handleChange}>
        Disabled
      </Checkbox>
    );
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders SVG checkmark when checked and variant is style1', () => {
    render(
      <Checkbox checked={true} variant="style1">
        Checkmark visible
      </Checkbox>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('checkbox').nextSibling).toBeTruthy();
  });

  it('renders style2 variant', () => {
    render(
      <Checkbox checked={true} variant="style2">
        Style2
      </Checkbox>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
