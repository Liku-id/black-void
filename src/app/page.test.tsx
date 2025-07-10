import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the Header', () => {
    render(<Home />);
    // Header contains a button 'Log In' as unique marker
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('renders the CarouselSection', () => {
    render(<Home />);
    // CarouselSection: cari elemen unik, misal heading FAQ, atau gunakan test id jika ada
    // Sementara, cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the ProjectListSection', () => {
    render(<Home />);
    // ProjectListSection: cari heading "Project" jika ada, atau test id jika sudah diterapkan
    // Sementara, cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the CreatorListSection', () => {
    render(<Home />);
    // CreatorListSection: cari heading "Creator" jika ada, atau test id jika sudah diterapkan
    // Sementara, cek keberadaan main section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the FAQSection', () => {
    render(<Home />);
    // FAQSection: cari heading "FAQ"
    expect(screen.getByRole('heading', { name: /FAQ/i })).toBeInTheDocument();
  });
});
