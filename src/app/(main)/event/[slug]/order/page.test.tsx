import { render, screen, waitFor } from '@testing-library/react';
import OrderPage from './page';
import { useAtom } from 'jotai';

// Mocks
jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'test-event' }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import useSWR from 'swr';

jest.mock('@/lib/session/use-auth', () => ({
  useAuth: () => ({ isLoggedIn: false, userData: null }),
}));

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  atom: jest.fn(),
}));

jest.mock('jotai/utils', () => ({
  atomWithStorage: jest.fn(),
}));

jest.mock('@/utils/timer', () => ({
  useCountdown: () => [900, jest.fn()],
}));

jest.mock('posthog-js', () => ({
  capture: jest.fn(),
}));

// Mock Child Components
jest.mock('@/components/event/contact-detail', () => () => <div data-testid="contact-detail-section">ContactDetailSection</div>);
jest.mock('@/components/event/visitor-detail', () => () => <div data-testid="visitor-detail-section">VisitorDetailSection</div>);
jest.mock('@/components/event/summary-section', () => () => <div data-testid="summary-section">SummarySection</div>);
jest.mock('@/components/event/summary-section/mobile', () => () => <div data-testid="summary-section-mobile">SummarySectionMobile</div>);
jest.mock('@/components/event/skeletons', () => () => <div data-testid="event-skeleton">EventSkeleton</div>);
jest.mock('@/components/layout/loading', () => () => <div data-testid="loading">Loading...</div>);

describe('OrderPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAtom as jest.Mock).mockReturnValue([{}, jest.fn()]);

    // Mock IntersectionObserver
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('renders loading skeleton when loading', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });
    // Mock atom to return orderId so it tries to fetch
    (useAtom as jest.Mock).mockImplementation((atom) => {
      return [{ orderId: '123' }, jest.fn()];
    });

    render(<OrderPage />);
    expect(screen.getByTestId('event-skeleton')).toBeInTheDocument();
  });

  it('renders error message on error', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
    });
    (useAtom as jest.Mock).mockImplementation((atom) => {
      return [{ orderId: '123' }, jest.fn()];
    });

    render(<OrderPage />);
    expect(screen.getByText('Failed to load order data')).toBeInTheDocument();
  });

  it('renders order details when data is loaded', () => {
    const mockEventData = { id: '1', name: 'Test Event' };
    const mockOrderData = {
      orderId: '123',
      tickets: [],
      ticketType: {},
      quantity: 1,
      expiredAt: new Date().toISOString(),
    };

    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key && key.includes('/api/events')) {
        return { data: mockEventData, isLoading: false };
      }
      if (key && key.includes('/api/order')) {
        return { data: mockOrderData, isLoading: false };
      }
      return { data: undefined, isLoading: false };
    });

    (useAtom as jest.Mock).mockImplementation((atom) => {
      // Simple mock for atoms, we assume orderId is present
      return [{ orderId: '123', full_name: '' }, jest.fn()];
    });

    render(<OrderPage />);

    expect(screen.getByTestId('contact-detail-section')).toBeInTheDocument();
    expect(screen.getByTestId('visitor-detail-section')).toBeInTheDocument();
    expect(screen.getByTestId('summary-section')).toBeInTheDocument();
  });
});
