import React from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from './index';

describe('Container', () => {
  it('renders children correctly', () => {
    render(<Container>Test content</Container>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Container className="custom-class">Content</Container>);
    const container = screen.getByText('Content');
    expect(container).toHaveClass('custom-class');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Container onClick={handleClick}>Click me</Container>);

    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has default container classes', () => {
    render(<Container>Content</Container>);
    const container = screen.getByText('Content');
    expect(container).toHaveClass('mx-auto', 'w-full', 'max-w-[1140px]', 'px-4');
  });

  it('combines custom className with default classes', () => {
    render(<Container className="custom-class">Content</Container>);
    const container = screen.getByText('Content');
    expect(container).toHaveClass('custom-class', 'mx-auto', 'w-full');
  });
});
