import { render, screen, waitFor } from '@testing-library/react';
import EventPage from './page';
import { useAuth } from '@/lib/session/use-auth';
import { useAtom } from 'jotai';

// Mocks
jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'test-event' }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/event/test-event',
  useSearchParams: () => ({ get: jest.fn(), toString: jest.fn() }),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import useSWR from 'swr';

jest.mock('@/lib/session/use-auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  atom: jest.fn(),
}));

jest.mock('jotai/utils', () => ({
  atomWithStorage: jest.fn(),
}));

jest.mock('posthog-js', () => ({
  capture: jest.fn(),
}));

// Mock Child Components
jest.mock('@/components/event/event-detail-section', () => () => <div data-testid="event-detail-section">EventDetailSection</div>);
jest.mock('@/components/event/ticket-list-section', () => () => <div data-testid="ticket-list-section">TicketListSection</div>);
jest.mock('@/components/event/summary-section', () => () => <div data-testid="summary-section">SummarySection</div>);
jest.mock('@/components/event/summary-section/mobile', () => () => <div data-testid="summary-section-mobile">SummarySectionMobile</div>);
jest.mock('@/components/event/owner-section', () => () => <div data-testid="owner-section">OwnerSection</div>);
jest.mock('@/components/event/event-modals', () => () => <div data-testid="event-modals">EventModals</div>);
jest.mock('@/components/event/skeletons', () => () => <div data-testid="event-skeleton">EventSkeleton</div>);
jest.mock('@/components/layout/loading', () => () => <div data-testid="loading">Loading...</div>);

describe('EventPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: false });
    (useAtom as jest.Mock).mockReturnValue([{}, jest.fn()]);
  });

  it('renders loading skeleton when loading', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<EventPage />);
    expect(screen.getByTestId('event-skeleton')).toBeInTheDocument();
  });

  it('renders error message on error', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
    });

    render(<EventPage />);
    expect(screen.getByText('Failed to load event data')).toBeInTheDocument();
  });

  it('renders event details when data is loaded', () => {
    const mockEventData = {
      id: '1',
      name: 'Test Event',
      eventStatus: 'published',
      ticketTypes: [],
      available_tickets: [],
      eventOrganizer: {},
    };

    (useSWR as jest.Mock).mockReturnValue({
      data: mockEventData,
      isLoading: false,
      error: undefined,
    });

    render(<EventPage />);

    expect(screen.getByTestId('event-detail-section')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-list-section')).toBeInTheDocument();
    expect(screen.getByTestId('summary-section')).toBeInTheDocument();
    expect(screen.getByTestId('owner-section')).toBeInTheDocument();
  });
});
