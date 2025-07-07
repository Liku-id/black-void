import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /Hello World/i })
    ).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to Black Void/i)).toBeInTheDocument();
  });

  it('renders the body text', () => {
    render(<Home />);
    expect(
      screen.getByText(/Built with Next.js 15 & Tailwind CSS 4/i)
    ).toBeInTheDocument();
  });

  it('renders the caption text', () => {
    render(<Home />);
    expect(screen.getByText(/This is a caption text/i)).toBeInTheDocument();
  });

  it('has correct container styling', () => {
    render(<Home />);
    const container = screen
      .getByText('Hello World')
      .closest('div')?.parentElement;
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-black',
      'text-white',
      'flex',
      'items-center',
      'justify-center'
    );
  });
});
