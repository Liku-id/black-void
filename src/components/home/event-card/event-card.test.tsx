import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from './index';

const defaultProps = {
  image: 'https://example.com/image.jpg',
  title: 'Project Title',
  location: 'Jakarta',
  date: '2024-06-01',
  price: 'Rp 100.000',
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

  it('handles image onError and onLoad', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<EventCard {...defaultProps} />);
    const img = screen.getByAltText(defaultProps.title) as HTMLImageElement;
    // Simulate onLoad
    fireEvent.load(img);
    expect(logSpy).toHaveBeenCalledWith(
      'Image loaded successfully:',
      defaultProps.image
    );
    // Simulate onError
    fireEvent.error(img);
    expect(logSpy).toHaveBeenCalledWith(
      'Image failed to load:',
      defaultProps.image
    );
    expect(img.src).toContain('dummyimage.com');
    logSpy.mockRestore();
  });
});
