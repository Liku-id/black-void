import React from 'react';
import { render, screen } from '@testing-library/react';
import { Box } from '.';

describe('Box', () => {
  it('renders children correctly', () => {
    render(<Box>Test content</Box>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Box className="custom-class">Content</Box>);
    const box = screen.getByText('Content');
    expect(box).toHaveClass('custom-class');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Box onClick={handleClick}>Click me</Box>);

    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
