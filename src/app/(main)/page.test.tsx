import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';


// Mock the getCarouselData function
jest.mock('@/components/home/carousel-section/carousel.data', () => ({
  getCarouselData: jest.fn().mockResolvedValue([]),
}));

describe('Home Page', () => {
  // Header sudah dirender di layout, tidak perlu dites di sini

  it('renders the CarouselSection', async () => {
    const ui = await Home();
    render(ui);
    // CarouselSection: cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the ProjectListSection', async () => {
    const ui = await Home();
    render(ui);
    // ProjectListSection: cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the CreatorListSection', async () => {
    const ui = await Home();
    render(ui);
    // CreatorListSection: cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the FAQSection', async () => {
    const ui = await Home();
    render(ui);
    // FAQSection: cari heading "FAQ"
    expect(screen.getByRole('heading', { name: /FAQ/i })).toBeInTheDocument();
  });
});
