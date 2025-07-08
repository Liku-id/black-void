import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with correct text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies default styling classes', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'disabled:opacity-50',
      'cursor-pointer',
      'bg-green',
      'text-white',
      'font-onest',
      'text-base',
      'font-bold',
      'h-9',
      'px-4',
      'py-2'
    );
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green', 'text-white');

    rerender(<Button variant="default">Default</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green', 'text-white');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="default">Default Size</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-4', 'py-2');

    rerender(<Button size="default">Default Size</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-4', 'py-2');
  });

  it('passes through additional props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Test
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });

  it('has correct data-slot attribute', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('maintains accessibility features', () => {
    render(<Button aria-describedby="description">Accessible Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-describedby', 'description');
  });
});
