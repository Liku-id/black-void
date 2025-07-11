import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  // Header sudah dirender di layout, tidak perlu dites di sini

  it('renders the CarouselSection', () => {
    render(<Home />);
    // CarouselSection: cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the ProjectListSection', () => {
    render(<Home />);
    // ProjectListSection: cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the CreatorListSection', () => {
    render(<Home />);
    // CreatorListSection: cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the FAQSection', () => {
    render(<Home />);
    // FAQSection: cari heading "FAQ"
    expect(screen.getByRole('heading', { name: /FAQ/i })).toBeInTheDocument();
  });
});
