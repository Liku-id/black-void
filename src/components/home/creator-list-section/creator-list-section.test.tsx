import { render, screen } from '@testing-library/react';
import CreatorListSection from './';
import '@testing-library/jest-dom';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CreatorCard agar mudah dicek
jest.mock('../creator-card', () => (props: any) => (
  <div data-testid="creator-card" {...props}>
    {props.name}
  </div>
));

// Mock components
jest.mock('@/components', () => ({
  Container: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Typography: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Slider: ({ children, autoScroll, gap, itemWidth }: any) => (
    <div
      data-testid="slider"
      data-auto-scroll={autoScroll}
      data-gap={gap}
      data-item-width={itemWidth}
    >
      {children}
    </div>
  ),
  Box: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}));

const mockSWR = require('swr').default;

describe('CreatorListSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section title and all CreatorCard components', () => {
    // Mock SWR to return data
    mockSWR.mockReturnValue({
      data: {
        eventOrganizers: [
          { id: 1, name: 'Creator 1', asset: { url: 'test1.jpg' } },
          { id: 2, name: 'Creator 2', asset: { url: 'test2.jpg' } },
          { id: 3, name: 'Creator 3', asset: { url: 'test3.jpg' } },
        ],
      },
      isLoading: false,
    });

    render(<CreatorListSection />);

    // Judul section
    expect(screen.getByText(/KREATOR WUKONG/i)).toBeInTheDocument();
    // Ada 3 CreatorCard
    const cards = screen.getAllByTestId('creator-card');
    expect(cards).toHaveLength(3);
    // Nama creator muncul
    expect(cards[0]).toHaveTextContent('Creator 1');
    expect(cards[1]).toHaveTextContent('Creator 2');
    expect(cards[2]).toHaveTextContent('Creator 3');
  });

  it('shows loading state', () => {
    mockSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<CreatorListSection />);

    expect(screen.getByText(/KREATOR WUKONG/i)).toBeInTheDocument();
    // Should show skeleton cards
    const skeletonCards = screen.getAllByTestId('creator-card');
    expect(skeletonCards).toHaveLength(6);
  });

  it('shows no creators message when no data', () => {
    mockSWR.mockReturnValue({
      data: { eventOrganizers: [] },
      isLoading: false,
    });

    render(<CreatorListSection />);

    expect(screen.getByText(/KREATOR WUKONG/i)).toBeInTheDocument();
    expect(screen.getByText('No creators found')).toBeInTheDocument();
  });
});
