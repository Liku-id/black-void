import { render, screen } from '@testing-library/react';
import CreatorListSection from './';
import '@testing-library/jest-dom';

// Mock CreatorCard agar mudah dicek
jest.mock('../creator-card', () => (props: any) => (
  <div data-testid="creator-card" {...props}>
    {props.name}
  </div>
));

// Mock useSWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from 'swr';

describe('CreatorListSection', () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReturnValue({
      data: {
        eventOrganizers: [
          { id: 1, name: 'Creator 1', asset_url: 'url1' },
          { id: 2, name: 'Creator 2', asset_url: 'url2' },
          { id: 3, name: 'Creator 3', asset_url: 'url3' },
          { id: 4, name: 'Creator 4', asset_url: 'url4' },
          { id: 5, name: 'Creator 5', asset_url: 'url5' },
          { id: 6, name: 'Creator 6', asset_url: 'url6' },
        ],
      },
      isLoading: false,
    });
  });

  it('renders section title and all CreatorCard components', () => {
    render(<CreatorListSection />);
    // Judul section
    expect(screen.getByText(/KREATOR WUKONG/i)).toBeInTheDocument();
    // Ada 6 CreatorCard
    const cards = screen.getAllByTestId('creator-card');
    expect(cards).toHaveLength(6);
    // Nama creator muncul
    expect(cards[0]).toHaveTextContent('Creator 1');
    expect(cards[1]).toHaveTextContent('Creator 2');
    expect(cards[2]).toHaveTextContent('Creator 3');
  });
});
