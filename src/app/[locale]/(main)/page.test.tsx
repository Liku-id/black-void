import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';


// Mock the getCarouselData function
jest.mock('@/components/home/carousel-section/carousel.data', () => ({
  getCarouselData: jest.fn().mockResolvedValue([]),
}));

// Mock next-intl server components
jest.mock('next-intl/server', () => ({
  __esModule: true,
  getTranslations: jest.fn().mockResolvedValue((key: string) => key),
  setRequestLocale: jest.fn(),
}));

jest.mock('@/components/home/event-list-section', () => ({
  __esModule: true,
  default: () => <div data-testid="event-list-section">Event List</div>,
}));

jest.mock('@/components/home/creator-list-section', () => ({
  __esModule: true,
  default: () => <div data-testid="creator-list-section">Creator List</div>,
}));

jest.mock('@/components/home/faq-section', () => ({
  __esModule: true,
  default: () => <div data-testid="faq-section">FAQ</div>,
}));

describe('Home Page', () => {
  // Header sudah dirender di layout, tidak perlu dites di sini

  it('renders the CarouselSection', async () => {
    const ui = await Home();
    render(ui);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the EventListSection', async () => {
    const ui = await Home();
    render(ui);
    expect(screen.getByTestId('event-list-section')).toBeInTheDocument();
  });

  it('renders the CreatorListSection', async () => {
    const ui = await Home();
    render(ui);
    expect(screen.getByTestId('creator-list-section')).toBeInTheDocument();
  });

  it('renders the FAQSection', async () => {
    const ui = await Home();
    render(ui);
    expect(screen.getByTestId('faq-section')).toBeInTheDocument();
  });
});
