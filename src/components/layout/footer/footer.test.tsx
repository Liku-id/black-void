import { render, screen } from '@testing-library/react';
import Footer from './index';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders logo', () => {
    render(<Footer />);
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('renders company name', () => {
    render(<Footer />);
    const companyNames = screen.getAllByText(/PT Aku Rela Kamu Bahagia/i);
    expect(companyNames.length).toBeGreaterThan(0);
  });

  it('renders company address', () => {
    render(<Footer />);
    expect(screen.getByText(/Jl\. Ciniru III No\.2/i)).toBeInTheDocument();
  });

  it('renders event type links', () => {
    render(<Footer />);
    expect(screen.getByText(/Music/i)).toBeInTheDocument();
    expect(screen.getByText(/Sports/i)).toBeInTheDocument();
    expect(screen.getByText(/Exhibition/i)).toBeInTheDocument();
    expect(screen.getByText(/Festival/i)).toBeInTheDocument();
  });

  it('renders about links', () => {
    render(<Footer />);
    expect(screen.getByText(/ABOUT WUKONG/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Cookie Policy/i)).toBeInTheDocument();
  });

  it('renders contact info', () => {
    render(<Footer />);
    expect(screen.getByText(/\+62 851-2132-8284/i)).toBeInTheDocument();
    expect(screen.getByText(/support@wukong.co.id/i)).toBeInTheDocument();
  });
});
