import { render, screen } from '@testing-library/react';
import EventListSection from '.';
import '@testing-library/jest-dom';
import * as useEventsModule from '@/hooks/use-events';

// Mock EventCard to avoid invalid DOM attributes
jest.mock('../event-card', () => ({ skeleton, metaUrl, title, ...rest }: any) => (
  <div
    data-testid={skeleton ? 'event-card-skeleton' : 'event-card'}
    className={skeleton ? 'animate-pulse' : ''}
    {...rest}
  >
    {title}
  </div>
));
jest.mock('@/components', () => ({
  TextField: (props: any) => <input data-testid="textfield" {...props} />,
  Box: (props: any) => <div {...props}>{props.children}</div>,
  Typography: (props: any) => <div {...props}>{props.children}</div>,
  Container: (props: any) => <div {...props}>{props.children}</div>,
}));

const mockUseEvents = jest.spyOn(useEventsModule, 'useEvents');

const defaultHookState = {
  events: [],
  error: undefined,
  isLoading: false,
  isLoadingMore: false,
  isReachingEnd: false,
  isEmpty: true,
  loadMore: jest.fn(),
};

describe('EventListSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders skeleton when loading', () => {
    mockUseEvents.mockReturnValue({ ...defaultHookState, isLoading: true, isEmpty: false });
    render(<EventListSection />);
    expect(screen.getAllByTestId('event-card-skeleton').length).toBeGreaterThanOrEqual(1);
  });

  it('renders event cards when data is present', () => {
    mockUseEvents.mockReturnValue({
      ...defaultHookState,
      isEmpty: false,
      isReachingEnd: true,
      events: [
        {
          id: 1,
          name: 'Event 1',
          eventAssets: [{ asset: { url: 'img1' } }],
          address: 'Loc 1',
          lowestPriceTicketType: { price: 10000 },
        },
        {
          id: 2,
          name: 'Event 2',
          eventAssets: [{ asset: { url: 'img2' } }],
          address: 'Loc 2',
          lowestPriceTicketType: { price: 20000 },
        },
      ],
    });
    render(<EventListSection />);
    const cards = screen.getAllByTestId('event-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Event 1');
    expect(cards[1]).toHaveTextContent('Event 2');
  });

  it('renders empty state when no events', () => {
    mockUseEvents.mockReturnValue({ ...defaultHookState, isEmpty: true });
    render(<EventListSection />);
    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
  });

  it('renders error message when error', () => {
    mockUseEvents.mockReturnValue({ ...defaultHookState, error: new Error('fail') });
    render(<EventListSection />);
    expect(screen.getByText(/failed to load events/i)).toBeInTheDocument();
  });

  it('renders end-of-list indicator when reaching end', () => {
    mockUseEvents.mockReturnValue({
      ...defaultHookState,
      isEmpty: false,
      isReachingEnd: true,
      events: [{ id: 1, name: 'Event 1' }],
    });
    render(<EventListSection />);
    expect(screen.getByText(/you've seen all events/i)).toBeInTheDocument();
  });
});
