import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './index';

describe('Checkbox', () => {
  it('renders children', () => {
    render(
      <Checkbox checked={false}>Label Text</Checkbox>
    );
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('renders as checked when checked=true', () => {
    render(
      <Checkbox checked={true}>Checked</Checkbox>
    );
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('renders as unchecked when checked=false', () => {
    render(
      <Checkbox checked={false}>Unchecked</Checkbox>
    );
    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('calls onChange when clicked and not disabled', () => {
    const handleChange = jest.fn();
    render(
      <Checkbox checked={false} onChange={handleChange}>Click me</Checkbox>
    );
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  // Note: Disabled checkbox may still trigger onChange in RTL, but not in real browser
}); 