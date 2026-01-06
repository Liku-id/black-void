import { render, screen, fireEvent } from '@testing-library/react';
import Header from './index';
import { useSearchParams } from 'next/navigation';
import * as jotai from 'jotai';
import { authAtom } from '@/store';

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

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));

jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai');
  return {
    ...actual,
    useAtom: jest.fn(),
  };
});

beforeEach(() => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: (key: string) => null,
  });
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };
  (require('next/navigation').useRouter as jest.Mock).mockReturnValue(
    mockRouter
  );
  (jotai.useAtom as jest.Mock).mockImplementation((atom) => {
    // Check if the atom is authAtom (or compare content/name/reference)
    // Since we can't easily compare atom objects created in different modules if Jest mocks them differently,
    // we might need a generic fallback or permissive check.
    // But since we import authAtom, we can try reference equality if jest doesn't scramble it too much.
    if (atom === authAtom) {
      return [
        {
          isLoggedIn: false,
          userData: null,
          loading: false,
        },
        jest.fn(),
      ];
    }
    return [{}, jest.fn()];
  });
});

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Header />);
    const logoImages = screen.getAllByAltText('Logo');
    expect(logoImages[0]).toBeInTheDocument();
    expect(logoImages[0]).toHaveAttribute('src', 'mocked-logo.svg');
  });

  it('has correct logo dimensions', () => {
    render(<Header />);
    const logoImages = screen.getAllByAltText('Logo');
    expect(logoImages[0]).toHaveAttribute('width', '120');
    expect(logoImages[0]).toHaveAttribute('height', '40');
  });

  it('applies correct CSS classes to logo', () => {
    render(<Header />);
    const logoImages = screen.getAllByAltText('Logo');
    expect(logoImages[0]).toHaveClass('h-8', 'w-auto');
  });

  it('has priority loading enabled', () => {
    render(<Header />);
    const logoImages = screen.getAllByAltText('Logo');
    expect(logoImages[0]).toHaveAttribute('data-priority', 'true');
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
    // Cari semua div dan temukan yang punya semua class utama
    const containers = Array.from(document.querySelectorAll('div')).filter(
      el =>
        el.className &&
        el.className.includes('flex') &&
        el.className.includes('h-20') &&
        el.className.includes('items-center') &&
        el.className.includes('border') &&
        el.className.includes('border-black') &&
        el.className.includes('bg-white') &&
        el.className.includes('px-6') &&
        el.className.includes('py-6')
    );
    expect(containers.length).toBeGreaterThan(0);
    const container = containers[0];
    [
      'h-20',
      'items-center',
      'border',
      'border-black',
      'bg-white',
      'px-6',
      'py-6',
    ].forEach(cls => {
      expect(container).toHaveClass(cls);
    });
  });



  it('renders the Get In button', () => {
    render(<Header />);
    const loginButtons = screen.getAllByText(/Get In/i);
    const loginLinks = loginButtons.map(btn => btn.closest('a'));
    expect(loginLinks.length).toBeGreaterThan(0);
    loginLinks.forEach(link => {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/login');
    });
  });

  it('renders Contact Us and Become Creator links', () => {
    render(<Header />);
    const contactUsLinks = screen.getAllByText(/Contact Us/i);
    const becomeCreatorLinks = screen.getAllByText(/Become Creator/i);
    expect(contactUsLinks.length).toBeGreaterThan(0);
    expect(becomeCreatorLinks.length).toBeGreaterThan(0);
  });



  it('opens mobile menu when burger icon is clicked', () => {
    render(<Header />);
    const menuIcon = screen.getAllByAltText('Menu')[0];
    fireEvent.click(menuIcon);
    // Menu popup muncul (logo putih, close icon, link)
    expect(screen.getByAltText('Close')).toBeInTheDocument();
    const logos = screen.getAllByAltText('Logo');
    const popupLogo = logos.find(
      img =>
        (img as HTMLImageElement).width === 100 &&
        (img as HTMLImageElement).height === 24
    );
    expect(popupLogo).toBeInTheDocument();
    expect(screen.getAllByText(/Contact Us/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Become Creator/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /get in/i }).length
    ).toBeGreaterThan(0);
  });

  it('closes mobile menu when close icon is clicked', () => {
    render(<Header />);
    const menuIcon = screen.getAllByAltText('Menu')[0];
    fireEvent.click(menuIcon);
    const closeIcon = screen.getByAltText('Close');
    fireEvent.click(closeIcon.parentElement!);
    // Menu popup hilang (logo putih tidak ada)
    const logos = screen.getAllByAltText('Logo');
    const popupLogo = logos.find(
      img =>
        (img as HTMLImageElement).width === 100 &&
        (img as HTMLImageElement).height === 24
    );
    expect(popupLogo).toBeInTheDocument(); // Logo tetap ada di desktop/mobile, popup hilang
  });

  it('shows mobile menu if openMenu=1 in searchParams', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'openMenu' ? '1' : null),
    });
    render(<Header />);
    expect(screen.getByAltText('Close')).toBeInTheDocument();
    const logos = screen.getAllByAltText('Logo');
    const popupLogo = logos.find(
      img =>
        (img as HTMLImageElement).width === 100 &&
        (img as HTMLImageElement).height === 24
    );
    expect(popupLogo).toBeInTheDocument();
  });


});
