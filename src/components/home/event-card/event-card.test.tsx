import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EventCard from './index';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, unoptimized }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-unoptimized={unoptimized}
    />
  ),
}));

// Mock components
jest.mock('@/components', () => ({
  Box: ({ children, className, onClick, ...props }: any) => (
    <div className={className} onClick={onClick} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, type, size, color, className, as }: any) => {
    const Component = as || 'span';
    return (
      <Component className={`${type}-${size} ${color} ${className}`}>
        {children}
      </Component>
    );
  },
  Button: ({ children, className, onClick, id, ...props }: any) => (
    <button className={className} onClick={onClick} id={id} {...props}>
      {children}
    </button>
  ),
}));

// Mock assets
jest.mock('@/assets/icons/location.svg', () => 'location.svg');
jest.mock('@/assets/icons/calendar.svg', () => 'calendar.svg');

describe('EventCard Component', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const defaultProps = {
    metaUrl: 'test-event',
    image: 'https://example.com/image.jpg',
    title: 'Test Event',
    location: 'Test Location',
    date: '2024-01-01',
    price: 'Rp 100.000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Normal State (skeleton = false)', () => {
    it('should render with all props', () => {
      render(<EventCard {...defaultProps} />);

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
      expect(screen.getByText('Rp 100.000')).toBeInTheDocument();
      expect(screen.getByText('Buy Ticket')).toBeInTheDocument();
    });

    it('should render event image when provided', () => {
      render(<EventCard {...defaultProps} />);

      const image = screen.getByAltText('Test Event');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('width', '270');
      expect(image).toHaveAttribute('height', '152');
      expect(image).toHaveAttribute('data-unoptimized', 'true');
    });

    it('should render fallback image when no image provided', () => {
      render(<EventCard {...defaultProps} image={undefined} />);

      const image = screen.getByAltText('Test Event');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        'https://dummyimage.com/270x152/CCCCCC/666666.png&text=No+Image'
      );
    });

    it('should render "No Image" placeholder when image is empty', () => {
      render(<EventCard {...defaultProps} image="" />);

      expect(screen.getByText('No Image')).toBeInTheDocument();
      expect(screen.queryByAltText('Test Event')).not.toBeInTheDocument();
    });

    it('should render location with icon', () => {
      render(<EventCard {...defaultProps} />);

      const locationIcon = screen.getByAltText('location');
      expect(locationIcon).toBeInTheDocument();
      expect(locationIcon).toHaveAttribute('src', 'location.svg');
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    it('should render date with icon', () => {
      render(<EventCard {...defaultProps} />);

      const calendarIcon = screen.getByAltText('calendar');
      expect(calendarIcon).toBeInTheDocument();
      expect(calendarIcon).toHaveAttribute('src', 'calendar.svg');
      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    });

    it('should navigate to event page when buy ticket is clicked', () => {
      render(<EventCard {...defaultProps} />);

      const buyButton = screen.getByText('Buy Ticket');
      fireEvent.click(buyButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/event/test-event');
    });

    it('should have correct button ID', () => {
      render(<EventCard {...defaultProps} />);

      const buyButton = screen.getByText('Buy Ticket');
      expect(buyButton).toHaveAttribute('id', 'test-event_buy_ticket_button');
    });

    it('should handle missing props gracefully', () => {
      render(<EventCard metaUrl="test-event" />);

      expect(screen.getByAltText('Event image')).toBeInTheDocument();
      expect(screen.getByText('Buy Ticket')).toBeInTheDocument();
    });

    it('should truncate long titles', () => {
      const longTitle =
        'This is a very long event title that should be truncated when it exceeds the available space';
      render(<EventCard {...defaultProps} title={longTitle} />);

      const titleElement = screen.getByText(longTitle);
      expect(titleElement).toHaveClass('truncate');
    });
  });

  describe('Skeleton State (skeleton = true)', () => {
    it('should render skeleton when skeleton prop is true', () => {
      render(<EventCard skeleton={true} />);

      // Should not render any actual content
      expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
      expect(screen.queryByText('Buy Ticket')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Test Event')).not.toBeInTheDocument();
    });

    it('should have skeleton animation classes', () => {
      render(<EventCard skeleton={true} />);

      const skeletonContainer = screen.getByTestId('skeleton-container');
      expect(skeletonContainer).toHaveClass('animate-pulse');
    });

    it('should render skeleton placeholders', () => {
      render(<EventCard skeleton={true} />);

      // Check for skeleton elements (gray backgrounds)
      const skeletonElements = document.querySelectorAll(
        '.bg-gray-200, .bg-gray-300, .bg-gray-100'
      );
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should have correct skeleton dimensions', () => {
      render(<EventCard skeleton={true} />);

      const skeletonContainer = screen.getByTestId('skeleton-container');
      expect(skeletonContainer).toHaveClass('w-[270px]');
    });
  });

  describe('Styling and Classes', () => {
    it('should have correct container classes', () => {
      render(<EventCard {...defaultProps} />);

      const container = screen.getByTestId('event-card-container');
      expect(container).toHaveClass(
        'h-auto',
        'w-[270px]',
        'border',
        'border-black',
        'bg-white',
        'p-0',
        'shadow-sm',
        'transition-all',
        'duration-300',
        'hover:scale-[1.02]',
        'hover:shadow-[6px_6px_0px_0px_#FFF]'
      );
    });

    it('should have correct image classes', () => {
      render(<EventCard {...defaultProps} />);

      const image = screen.getByAltText('Test Event');
      expect(image).toHaveClass('h-[152px]', 'w-full', 'object-cover');
    });

    it('should have correct title typography', () => {
      render(<EventCard {...defaultProps} />);

      const title = screen.getByText('Test Event');
      expect(title).toHaveClass(
        'heading-26',
        'text-black',
        'mb-3',
        'truncate',
        'leading-none'
      );
    });

    it('should have correct price typography', () => {
      render(<EventCard {...defaultProps} />);

      const price = screen.getByText('Rp 100.000');
      expect(price).toHaveClass(
        'heading-22',
        'text-black',
        'font-bebas',
        'leading-none'
      );
    });

    it('should have correct button styling', () => {
      render(<EventCard {...defaultProps} />);

      const button = screen.getByText('Buy Ticket');
      expect(button).toHaveClass('bg-green', 'px-2', 'py-1', 'text-white');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      render(<EventCard {...defaultProps} />);

      const eventImage = screen.getByAltText('Test Event');
      const locationIcon = screen.getByAltText('location');
      const calendarIcon = screen.getByAltText('calendar');

      expect(eventImage).toBeInTheDocument();
      expect(locationIcon).toBeInTheDocument();
      expect(calendarIcon).toBeInTheDocument();
    });

    it('should have proper button ID for tracking', () => {
      render(<EventCard {...defaultProps} />);

      const button = screen.getByText('Buy Ticket');
      expect(button).toHaveAttribute('id', 'test-event_buy_ticket_button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<EventCard {...defaultProps} title="" />);

      const image = screen.getByAltText('Event image');
      expect(image).toBeInTheDocument();
    });

    it('should handle empty location', () => {
      render(<EventCard {...defaultProps} location="" />);

      // Empty location text is not rendered - use a more specific selector
      const locationElement = document.querySelector('.body-undefined');
      expect(locationElement).toBeInTheDocument();
      expect(locationElement?.textContent).toBe('');
    });

    it('should handle empty date', () => {
      render(<EventCard {...defaultProps} date="" />);

      // Empty date text is not rendered - use a more specific selector
      const dateElement = document.querySelectorAll('.body-undefined')[1];
      expect(dateElement).toBeInTheDocument();
      expect(dateElement?.textContent).toBe('');
    });

    it('should handle empty price', () => {
      render(<EventCard {...defaultProps} price="" />);

      // Empty price text is not rendered - use a more specific selector
      const priceElement = document.querySelector('.heading-22');
      expect(priceElement).toBeInTheDocument();
      expect(priceElement?.textContent).toBe('');
    });

    it('should handle missing metaUrl', () => {
      render(<EventCard {...defaultProps} metaUrl={undefined} />);

      const button = screen.getByText('Buy Ticket');
      expect(button).toHaveAttribute('id', 'undefined_buy_ticket_button');
    });
  });

  describe('Responsive Design', () => {
    it('should have fixed width for consistent layout', () => {
      render(<EventCard {...defaultProps} />);

      const container = document.querySelector('[class*="w-[270px]"]');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('w-[270px]');
    });

    it('should have proper image aspect ratio', () => {
      render(<EventCard {...defaultProps} />);

      const image = screen.getByAltText('Test Event');
      expect(image).toHaveClass('h-[152px]', 'w-full');
    });
  });

  describe('Interaction States', () => {
    it('should have hover effects', () => {
      render(<EventCard {...defaultProps} />);

      const container = document.querySelector('[class*="hover:scale-[1.02]"]');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(
        'hover:scale-[1.02]',
        'hover:shadow-[6px_6px_0px_0px_#FFF]'
      );
    });

    it('should have smooth transitions', () => {
      render(<EventCard {...defaultProps} />);

      const container = document.querySelector('[class*="transition-all"]');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('transition-all', 'duration-300');
    });
  });
});
