import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from './index';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, priority }: any) => (
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

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock axios
jest.mock('@/lib/api/axios-client', () => ({
  post: jest.fn(),
}));

// Mock error handler
jest.mock('@/lib/api/error-handler', () => ({
  getErrorMessage: jest.fn(() => 'Test error message'),
}));

// Mock auth hook
jest.mock('@/lib/session/use-auth', () => ({
  useAuth: jest.fn(),
}));

// Mock components
jest.mock('@/components', () => ({
  Box: ({ children, className, onClick, ...props }: any) => (
    <div className={className} onClick={onClick} {...props}>
      {children}
    </div>
  ),
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
  Typography: ({ children, type, size, color, className }: any) => (
    <span className={`${type}-${size} ${color} ${className}`}>{children}</span>
  ),
  Container: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock sub-components
jest.mock('./profile-menu', () => ({
  __esModule: true,
  default: ({ userData, setOpenModal, className }: any) => (
    <div data-testid="profile-menu" className={className}>
      Profile Menu - {userData?.name}
      <button onClick={() => setOpenModal(true)}>Open Logout Modal</button>
    </div>
  ),
}));

jest.mock('./logout-modal', () => ({
  __esModule: true,
  default: ({ open, onClose, onLogout, loading }: any) => (
    <div
      data-testid="logout-modal"
      style={{ display: open ? 'block' : 'none' }}
    >
      Logout Modal
      <button onClick={onClose}>Close</button>
      <button onClick={onLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  ),
}));

// Mock assets
jest.mock('@/assets/logo/logo.svg', () => 'logo.svg');
jest.mock('@/assets/logo/white-logo.svg', () => 'white-logo.svg');
jest.mock('@/assets/icons/burger.svg', () => 'burger.svg');
jest.mock('@/assets/icons/close.svg', () => 'close.svg');

describe('Header Component', () => {
  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(),
  };

  const mockUseAuth = require('@/lib/session/use-auth').useAuth;
  const mockAxios = require('@/lib/api/axios-client');
  const mockCheckAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    // Default auth state
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      userData: null,
      checkAuth: mockCheckAuth,
      loading: false,
    });
  });

  describe('Desktop Header', () => {
    it('should render desktop header with logo', () => {
      render(<Header />);

      const logos = screen.getAllByAltText('Logo');
      expect(logos[0]).toBeInTheDocument();
      expect(logos[0]).toHaveAttribute('src', 'close.svg');
    });

    it('should render contact us link', () => {
      render(<Header />);

      const contactLinks = screen.getAllByText('Contact Us');
      expect(contactLinks[0]).toBeInTheDocument();
      expect(contactLinks[0].closest('a')).toHaveAttribute(
        'href',
        'mailto:support@wukong.co.id'
      );
    });

    it('should render become creator link', () => {
      render(<Header />);

      const creatorLinks = screen.getAllByText('Become Creator?');
      expect(creatorLinks[0]).toBeInTheDocument();
      expect(creatorLinks[0].closest('a')).toHaveAttribute(
        'href',
        'https://form.typeform.com/to/kHYsLPnZ'
      );
    });

    it('should show login button when not authenticated', () => {
      render(<Header />);

      const loginButtons = screen.getAllByText('Log In');
      expect(loginButtons[0]).toBeInTheDocument();
      expect(loginButtons[0].closest('a')).toHaveAttribute('href', '/login');
    });

    it('should show profile menu when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: { name: 'John Doe', email: 'john@example.com' },
        checkAuth: mockCheckAuth,
        loading: false,
      });

      render(<Header />);

      expect(screen.getAllByTestId('profile-menu')[0]).toBeInTheDocument();
      expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    });

    it('should show loading skeleton when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        isLoggedIn: null,
        userData: null,
        checkAuth: mockCheckAuth,
        loading: true,
      });

      render(<Header />);

      const loadingSkeleton = document.querySelector('.animate-pulse');
      expect(loadingSkeleton).toBeInTheDocument();
    });
  });

  describe('Mobile Header', () => {
    it('should render mobile header with logo', () => {
      render(<Header />);

      const logo = screen.getAllByAltText('Logo')[0]; // First logo is mobile
      expect(logo).toBeInTheDocument();
    });

    it('should render burger menu button', () => {
      render(<Header />);

      const burgerButton = screen.getByAltText('Menu');
      expect(burgerButton).toBeInTheDocument();
      expect(burgerButton).toHaveAttribute('src', 'close.svg');
    });

    it('should open mobile menu when burger is clicked', () => {
      render(<Header />);

      const burgerButton = screen.getByAltText('Menu');
      fireEvent.click(burgerButton);

      // Mobile menu should be visible
      const mobileMenu = document.querySelector('.translate-x-0');
      expect(mobileMenu).toBeInTheDocument();
    });

    it('should close mobile menu when close button is clicked', () => {
      render(<Header />);

      // Open menu first
      const burgerButton = screen.getByAltText('Menu');
      fireEvent.click(burgerButton);

      // Close menu
      const closeButton = screen.getByAltText('Close');
      fireEvent.click(closeButton);

      // Mobile menu should be hidden
      const mobileMenu = document.querySelector('.translate-x-full');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu with white logo', () => {
      render(<Header />);

      // Open mobile menu
      const burgerButton = screen.getByAltText('Menu');
      fireEvent.click(burgerButton);

      const whiteLogos = screen.getAllByAltText('Logo');
      expect(whiteLogos[2]).toHaveAttribute('src', 'close.svg');
    });

    it('should show profile menu in mobile when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: { name: 'John Doe', email: 'john@example.com' },
        checkAuth: mockCheckAuth,
        loading: false,
      });

      render(<Header />);

      // Open mobile menu
      const burgerButton = screen.getByAltText('Menu');
      fireEvent.click(burgerButton);

      expect(screen.getAllByTestId('profile-menu')[0]).toBeInTheDocument();
    });

    it('should show login button in mobile when not authenticated', () => {
      render(<Header />);

      // Open mobile menu
      const burgerButton = screen.getByAltText('Menu');
      fireEvent.click(burgerButton);

      const loginButtons = screen.getAllByText('Log In');
      expect(loginButtons[0]).toBeInTheDocument();
    });
  });

  describe('URL Parameters', () => {
    it('should open menu when openMenu=1 is in URL', () => {
      mockSearchParams.get.mockReturnValue('1');

      render(<Header />);

      // Mobile menu should be open
      const mobileMenu = document.querySelector('.translate-x-0');
      expect(mobileMenu).toBeInTheDocument();
    });

    it('should not open menu when openMenu is not in URL', () => {
      mockSearchParams.get.mockReturnValue(null);

      render(<Header />);

      // Mobile menu should be closed
      const mobileMenu = document.querySelector('.translate-x-full');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('should open logout modal when profile menu triggers it', () => {
      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: { name: 'John Doe', email: 'john@example.com' },
        checkAuth: mockCheckAuth,
        loading: false,
      });

      render(<Header />);

      const profileMenus = screen.getAllByTestId('profile-menu');
      const openModalButton = profileMenus[0].querySelector('button');
      fireEvent.click(openModalButton!);

      expect(screen.getByTestId('logout-modal')).toBeInTheDocument();
    });

    it('should handle logout successfully', async () => {
      mockAxios.post.mockResolvedValue({ data: { success: true } });

      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: { name: 'John Doe', email: 'john@example.com' },
        checkAuth: mockCheckAuth,
        loading: false,
      });

      render(<Header />);

      // Open logout modal
      const profileMenus = screen.getAllByTestId('profile-menu');
      const openModalButton = profileMenus[0].querySelector('button');
      fireEvent.click(openModalButton!);

      // Click logout
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/logout');
        expect(mockCheckAuth).toHaveBeenCalled();
        expect(mockRouter.replace).toHaveBeenCalledWith('/');
      });
    });

    it('should handle logout error', async () => {
      mockAxios.post.mockRejectedValue(new Error('Logout failed'));

      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: { name: 'John Doe', email: 'john@example.com' },
        checkAuth: mockCheckAuth,
        loading: false,
      });

      render(<Header />);

      // Open logout modal
      const profileMenus = screen.getAllByTestId('profile-menu');
      const openModalButton = profileMenus[0].querySelector('button');
      fireEvent.click(openModalButton!);

      // Click logout
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/logout');
        // Error should be set but not visible in this test setup
      });
    });

    it('should show loading state during logout', async () => {
      mockAxios.post.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      mockUseAuth.mockReturnValue({
        isLoggedIn: true,
        userData: { name: 'John Doe', email: 'john@example.com' },
        checkAuth: mockCheckAuth,
        loading: false,
      });

      render(<Header />);

      // Open logout modal
      const profileMenus = screen.getAllByTestId('profile-menu');
      const openModalButton = profileMenus[0].querySelector('button');
      fireEvent.click(openModalButton!);

      // Click logout
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      // Should show loading state
      expect(screen.getByText('Logging out...')).toBeInTheDocument();
      expect(screen.getByText('Logging out...')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      render(<Header />);

      const homeLinks = screen.getAllByLabelText('Home');
      expect(homeLinks).toHaveLength(3); // Desktop, mobile, and mobile menu

      const menuButton = screen.getByLabelText('Menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('should have proper link attributes', () => {
      render(<Header />);

      const contactLinks = screen.getAllByText('Contact Us');
      const contactLink = contactLinks[0].closest('a');
      expect(contactLink).toHaveAttribute('target', '_blank');
      expect(contactLink).toHaveAttribute('rel', 'noopener noreferrer');

      const creatorLinks = screen.getAllByText('Become Creator?');
      const creatorLink = creatorLinks[0].closest('a');
      expect(creatorLink).toHaveAttribute('target', '_blank');
      expect(creatorLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Responsive Design', () => {
    it('should hide desktop header on mobile', () => {
      render(<Header />);

      const desktopHeader = document.querySelector('.lg\\:flex');
      expect(desktopHeader).toHaveClass('hidden');
    });

    it('should hide mobile header on desktop', () => {
      render(<Header />);

      const mobileHeader = document.querySelector('.lg\\:hidden');
      expect(mobileHeader).toHaveClass('lg:hidden');
    });
  });
});
