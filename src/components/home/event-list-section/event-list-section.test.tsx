import { render, screen } from '@testing-library/react';
import EventListSection from '.';
import '@testing-library/jest-dom';
import useSWR from 'swr';

// Mock EventCard dan TextField agar mudah dicek
jest.mock('../event-card', () => (props: any) => (
  <div data-testid="event-card" {...props}>
    {props.title}
  </div>
));
jest.mock('@/components', () => ({
  TextField: (props: any) => <input data-testid="textfield" {...props} />,
  Box: (props: any) => <div {...props}>{props.children}</div>,
  Typography: (props: any) => <div {...props}>{props.children}</div>,
  Container: (props: any) => <div {...props}>{props.children}</div>,
}));

jest.mock('swr');
const mockedUseSWR = useSWR as jest.Mock;

describe('EventListSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders skeleton when loading', () => {
    mockedUseSWR.mockReturnValue({ isLoading: true });
    render(<EventListSection />);
    expect(
      screen.getAllByText('', { selector: '.animate-pulse' })
    ).toHaveLength(4);
  });

  it('renders event cards when data is present', () => {
    mockedUseSWR.mockReturnValue({
      isLoading: false,
      data: {
        events: [
          {
            id: 1,
            name: 'Event 1',
            eventAssets: [{ asset: { url: 'img1' } }],
            address: 'Loc 1',
            createdAt: '2025-07-14 18:51:19.91875 +0700',
            lowestPriceTicketType: { price: 10000 },
          },
          {
            id: 2,
            name: 'Event 2',
            eventAssets: [{ asset: { url: 'img2' } }],
            address: 'Loc 2',
            createdAt: '2025-07-14 18:51:19.91875 +0700',
            lowestPriceTicketType: { price: 20000 },
          },
        ],
      },
    });
    render(<EventListSection />);
    const cards = screen.getAllByTestId('event-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Event 1');
    expect(cards[1]).toHaveTextContent('Event 2');
  });

  it('renders empty state when no events', () => {
    mockedUseSWR.mockReturnValue({ isLoading: false, data: { events: [] } });
    render(<EventListSection />);
    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
  });

  it('renders error message when error', () => {
    mockedUseSWR.mockReturnValue({ isLoading: false, error: true });
    render(<EventListSection />);
    expect(screen.getByText(/failed to load events/i)).toBeInTheDocument();
  });
});
