import { render, screen, fireEvent } from '@testing-library/react';
import BecomeCreatorPage from './page';
import posthog from 'posthog-js';

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock posthog
jest.mock('posthog-js', () => ({
  capture: jest.fn(),
}));

// Mock assets
jest.mock('@/assets/images/creator-main.webp', () => 'creator-main.webp');
jest.mock('@/assets/images/creator-1.webp', () => 'creator-1.webp');
jest.mock('@/assets/images/creator-2.webp', () => 'creator-2.webp');
jest.mock('@/assets/images/creator-3.webp', () => 'creator-3.webp');
jest.mock('@/assets/images/creator-4.webp', () => 'creator-4.webp');
jest.mock('@/assets/icons/brush.svg', () => 'brush.svg');
jest.mock('@/assets/icons/window.svg', () => 'window.svg');
jest.mock('@/assets/icons/handshake.svg', () => 'handshake.svg');
jest.mock('@/assets/icons/sunflower.svg', () => 'sunflower.svg');

// Mock components
jest.mock('@/components/layout/stripe-text', () => () => <div data-testid="stripe-text">StripeText</div>);

describe('BecomeCreatorPage', () => {
  const originalOpen = window.open;
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: originalOpen,
    });
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section correctly', () => {
    render(<BecomeCreatorPage />);
    expect(screen.getAllByText(/CREATING TOGETHER, ONE EVENT AT A TIME/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Create My Event/i)[0]).toBeInTheDocument();
  });

  it('renders features section correctly', () => {
    render(<BecomeCreatorPage />);
    expect(screen.getByText('SEAMLESS EMPOWERMENT')).toBeInTheDocument();
    expect(screen.getByText('CLARITY & SUPPORT')).toBeInTheDocument();
    expect(screen.getByText('FROM LOCAL ROOTS TO GLOBAL REACH')).toBeInTheDocument();
    expect(screen.getByText('PURPOSE WITH PRESENCE')).toBeInTheDocument();
  });

  it('handles Create My Event click', () => {
    process.env.NEXT_PUBLIC_CREATOR_BASE_URL = 'https://creator.wukong.co.id';
    render(<BecomeCreatorPage />);

    const createBtn = screen.getAllByText('Create My Event')[0];
    fireEvent.click(createBtn);

    expect(posthog.capture).toHaveBeenCalledWith('become_creator_clicked', expect.any(Object));
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://creator.wukong.co.id'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('handles Talk to Our Team click', () => {
    render(<BecomeCreatorPage />);

    const talkBtn = screen.getByText('Talk to Our Team');
    fireEvent.click(talkBtn);

    expect(window.location.href).toBe('mailto:support@wukong.co.id');
  });
});
