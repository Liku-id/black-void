import { render, screen } from '@testing-library/react';
import { Typography } from './index';

describe('Typography', () => {
  it('renders with default props', () => {
    render(<Typography>Hello World</Typography>);
    const element = screen.getByText('Hello World');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('renders with custom element type', () => {
    render(<Typography as="h1">Heading</Typography>);
    const element = screen.getByText('Heading');
    expect(element.tagName).toBe('H1');
  });

  it('applies heading font class when type is heading', () => {
    render(<Typography type="heading">Heading Text</Typography>);
    const element = screen.getByText('Heading Text');
    expect(element).toHaveClass('font-bebas');
  });

  it('applies body font class when type is body', () => {
    render(<Typography type="body">Body Text</Typography>);
    const element = screen.getByText('Body Text');
    expect(element).toHaveClass('font-onest');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Typography size={12}>Small Text</Typography>);
    expect(screen.getByText('Small Text')).toHaveClass('text-[12px]');

    rerender(<Typography size={14}>Medium Text</Typography>);
    expect(screen.getByText('Medium Text')).toHaveClass('text-[14px]');

    rerender(<Typography size={16}>Large Text</Typography>);
    expect(screen.getByText('Large Text')).toHaveClass('text-[16px]');

    rerender(<Typography size={24}>Extra Large Text</Typography>);
    expect(screen.getByText('Extra Large Text')).toHaveClass('text-[24px]');

    rerender(<Typography size={64}>Huge Text</Typography>);
    expect(screen.getByText('Huge Text')).toHaveClass('text-[64px]');
  });

  it('applies custom color classes', () => {
    render(<Typography color="text-white">White Text</Typography>);
    const element = screen.getByText('White Text');
    expect(element).toHaveClass('text-white');
  });

  it('applies custom className', () => {
    render(<Typography className="custom-class">Custom Text</Typography>);
    const element = screen.getByText('Custom Text');
    expect(element).toHaveClass('custom-class');
  });

  it('combines all props correctly', () => {
    render(
      <Typography
        as="h2"
        type="heading"
        size={24}
        color="text-red"
        className="custom-class">
        Combined Props
      </Typography>
    );

    const element = screen.getByText('Combined Props');
    expect(element.tagName).toBe('H2');
    expect(element).toHaveClass(
      'font-bebas',
      'text-[24px]',
      'text-red',
      'custom-class'
    );
  });

  it('passes through additional props', () => {
    render(
      <Typography data-testid="typography" id="test-id">
        Test Text
      </Typography>
    );

    const element = screen.getByTestId('typography');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  it('handles undefined size gracefully', () => {
    render(<Typography size={999}>Unknown Size</Typography>);
    const element = screen.getByText('Unknown Size');
    // Should fallback to default size
    expect(element).toHaveClass('text-[16px]');
  });

  it('renders children correctly', () => {
    render(
      <Typography>
        <span>Nested</span> Content
      </Typography>
    );

    expect(screen.getByText('Nested')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
