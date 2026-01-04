import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from './index';

// Mock next/image to avoid unoptimized warning and render predictable img
jest.mock('next/image', () => ({ unoptimized, ...props }: any) => <img {...props} />);

const defaultProps = {
  image: 'https://example.com/image.jpg',
  title: 'Project Title',
  location: 'Jakarta',
  date: '2024-06-01',
  price: 'Rp 100.000',
  status: 'on_going',
};

describe('EventCard', () => {
  it('renders all props correctly', () => {
    render(<EventCard {...defaultProps} />);
    expect(screen.getByAltText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.location)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.date)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.price)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /buy ticket/i })
    ).toBeInTheDocument();
  });

  it('renders location and calendar icons', () => {
    render(<EventCard {...defaultProps} />);
    expect(screen.getByAltText('location')).toBeInTheDocument();
    expect(screen.getByAltText('calendar')).toBeInTheDocument();
  });

  it('applies main container class', () => {
    const { container } = render(<EventCard {...defaultProps} />);
    expect(container.firstChild).toHaveClass('w-[270px]');
    expect(container.firstChild).toHaveClass('bg-white');
    expect(container.firstChild).toHaveClass(
      'hover:shadow-[6px_6px_0px_0px_#FFF]'
    );
  });
});
