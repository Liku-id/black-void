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

describe('Header', () => {
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
    // Cari container utama dengan kombinasi class Tailwind
    const container = document.querySelector(
      '.flex.h-20.items-center.border.border-black.bg-white.px-6.py-6'
    );
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      'flex',
      'h-20',
      'items-center',
      'border',
      'border-black',
      'bg-white',
      'px-6',
      'py-6'
    );
  });

  it('renders the search input', () => {
    render(<Header />);
    expect(
      screen.getByPlaceholderText('Looking for an exciting event?')
    ).toBeInTheDocument();
  });

  it('renders the Log In button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders Contact Us and Become Creator links', () => {
    render(<Header />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Become Creator/i)).toBeInTheDocument();
  });

  it('calls search handler when search icon is clicked', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Header />);
    const input = screen.getByPlaceholderText('Looking for an exciting event?');
    fireEvent.change(input, { target: { value: 'test event' } });
    // Cari end icon (search icon) dengan alt text 'End icon'
    const searchIcon = screen.getByAltText('End icon');
    fireEvent.click(searchIcon);
    expect(consoleSpy).toHaveBeenCalledWith('search:', 'test event');
    consoleSpy.mockRestore();
  });
});
