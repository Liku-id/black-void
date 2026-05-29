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
  it('renders correctly', async () => {
    const component = await HeroSection();
    render(component);

    expect(screen.getByText((content) => content.includes('All in One Ticketing &'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Event Management System Platform'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('A simple, powerful ticketing system designed for creators'))).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Explore Wukong/i })).toBeInTheDocument();
  });


});
