import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './index';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('HeroSection', () => {
  it('renders correctly', () => {
    render(<HeroSection />);

    expect(screen.getByText(/All in One Ticketing & Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Management System Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/A simple, powerful ticketing system designed for creators/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Start Funding/i })).toBeInTheDocument();
  });

  it('handles button click', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<HeroSection />);

    const button = screen.getByRole('button', { name: /Start Funding/i });
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('Start Funding Clicked');
  });
});
