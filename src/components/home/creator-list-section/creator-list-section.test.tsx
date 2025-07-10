import { render, screen } from '@testing-library/react';
import CreatorListSection from './';
import '@testing-library/jest-dom';

// Mock CreatorCard agar mudah dicek
jest.mock('../creator-card', () => (props: any) => <div data-testid="creator-card" {...props}>{props.name}</div>);

describe('CreatorListSection', () => {
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