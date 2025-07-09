import { render, screen, fireEvent } from '@testing-library/react';
import Header from './index';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
    priority,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-priority={priority}
    />
  ),
}));

// Mock the logo import
jest.mock('@/assets/logo/logo.svg', () => 'mocked-logo.svg');

// Mock console.log to spy on it
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Header', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Header />);
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mocked-logo.svg');
  });

  it('has correct logo dimensions', () => {
    render(<Header />);
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toHaveAttribute('width', '120');
    expect(logoImage).toHaveAttribute('height', '40');
  });

  it('applies correct CSS classes to logo', () => {
    render(<Header />);
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toHaveClass('h-8', 'w-auto');
  });

  it('has priority loading enabled', () => {
    render(<Header />);
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toHaveAttribute('data-priority', 'true');
  });

  it('has correct header positioning classes', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'fixed',
      'top-6',
      'right-0',
      'left-0',
      'z-50',
      'flex',
      'justify-center'
    );
  });

  it('has correct container structure', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    const container = header.querySelector('.w-\\[1140px\\]');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      'flex',
      'h-20',
      'w-[1140px]',
      'items-center',
      'border',
      'border-black',
      'bg-white',
      'px-[40px]',
      'py-6'
    );
  });

  it('renders submit button', () => {
    render(<Header />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('submit button is disabled when search input is empty', () => {
    render(<Header />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled when search input has value', () => {
    render(<Header />);
    const searchInput = screen.getByPlaceholderText(
      'Looking for an exciting event?'
    );
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(searchInput, { target: { value: 'test event' } });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls submit handler when button is clicked with search value', () => {
    render(<Header />);
    const searchInput = screen.getByPlaceholderText(
      'Looking for an exciting event?'
    );
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(searchInput, { target: { value: 'test event' } });
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith('submit search:', 'test event');
  });

  it('does not call submit handler when button is clicked with empty search', () => {
    render(<Header />);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    expect(consoleSpy).not.toHaveBeenCalledWith(
      'submit search:',
      expect.any(String)
    );
  });
});
