import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventDetail from './index';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
    draggable,
    unoptimized,
  }: any) => (
    <img
      src={typeof src === 'string' ? src : 'test-file-stub'}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-draggable={draggable}
      data-unoptimized={unoptimized}
    />
  ),
}));

// Mock components
jest.mock('@/components', () => ({
  Box: ({
    children,
    className,
    onClick,
    'data-testid': testId,
    ...props
  }: any) => (
    <div
      className={className}
      onClick={onClick}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  ),
  Typography: ({ children, type, size, color, className }: any) => (
    <span className={`${type}-${size || 'undefined'} ${color} ${className}`}>
      {children}
    </span>
  ),
  Button: ({ children, className, onClick, ...props }: any) => (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Slider: ({
    children,
    className,
    itemWidth,
    pagination,
    autoScroll,
    'data-testid': testId,
  }: any) => (
    <div
      className={className}
      data-item-width={itemWidth}
      data-pagination={pagination}
      data-auto-scroll={autoScroll}
      data-testid={testId}
    >
      {children}
    </div>
  ),
}));

// Mock carousel component
jest.mock('@/components/common/carousel', () => ({
  Carousel: ({
    images,
    width,
    height,
    sizes,
    className,
    arrowPosition,
    'data-testid': testId,
  }: any) => (
    <div
      className={className}
      data-width={width}
      data-height={height}
      data-sizes={sizes}
      data-arrow-position={arrowPosition}
      data-testid={testId}
    >
      {images.map((image: string, index: number) => (
        <img key={index} src={image} alt={`Carousel image ${index + 1}`} />
      ))}
    </div>
  ),
}));

// Mock assets - using fileMock.js

// Mock formatter utilities
jest.mock('@/utils/formatter', () => ({
  formatRupiah: jest.fn((amount) => `Rp ${amount.toLocaleString()}`),
  formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
  formatTime: jest.fn((date) => new Date(date).toLocaleTimeString()),
}));

describe('EventDetail Component', () => {
  const mockOnChooseTicket = jest.fn();

  const mockEventData = {
    name: 'Test Event',
    address: 'Test Address, Jakarta',
    startDate: '2024-01-01T10:00:00Z',
    endDate: '2024-01-01T18:00:00Z',
    description:
      'This is a test event description that provides details about the event.',
    eventAssets: [
      {
        asset: {
          url: 'https://example.com/image1.jpg',
        },
      },
      {
        asset: {
          url: 'https://example.com/image2.jpg',
        },
      },
    ],
    ticketTypes: [
      {
        price: 100000,
        name: 'VIP Ticket',
      },
      {
        price: 50000,
        name: 'Regular Ticket',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('should render the main section', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render the event title', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    it('should render the event details section', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(screen.getByText('Event Details')).toBeInTheDocument();
    });
  });

  describe('Image Carousel', () => {
    it('should render mobile slider with event assets', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const slider = document.querySelector('[data-item-width="375"]');
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('data-item-width', '375');
      expect(slider).toHaveAttribute('data-pagination', 'true');
      expect(slider).toHaveAttribute('data-auto-scroll', 'false');
    });

    it('should render desktop carousel with event assets', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const carousel = document.querySelector('[data-width="613"]');
      expect(carousel).toBeInTheDocument();
      expect(carousel).toHaveAttribute('data-width', '613');
      expect(carousel).toHaveAttribute('data-height', '309');
      expect(carousel).toHaveAttribute('data-arrow-position', 'inside');
    });

    it('should render all event images', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const images = screen.getAllByAltText(/Image \d+|Carousel image \d+/);
      expect(images).toHaveLength(4); // 2 for mobile slider + 2 for desktop carousel
    });

    it('should handle empty event assets', () => {
      const eventDataWithoutAssets = { ...mockEventData, eventAssets: [] };
      render(
        <EventDetail
          data={eventDataWithoutAssets}
          onChooseTicket={mockOnChooseTicket}
        />
      );

      const images = screen.queryAllByAltText(/Image \d+|Carousel image \d+/);
      expect(images).toHaveLength(0);
    });
  });

  describe('Event Information', () => {
    it('should render event address with location icon', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const locationIcon = screen.getAllByAltText('location')[0];
      expect(locationIcon).toBeInTheDocument();
      expect(locationIcon).toHaveAttribute('src', 'test-file-stub');
      expect(screen.getByText('Test Address, Jakarta')).toBeInTheDocument();
    });

    it('should render event date with calendar icon', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const calendarIcon = screen.getAllByAltText('location')[1]; // Second location alt is calendar
      expect(calendarIcon).toBeInTheDocument();
      expect(calendarIcon).toHaveAttribute('src', 'test-file-stub');
    });

    it('should render ticket price with ticket icon', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const ticketIcon = screen.getByAltText('ticket');
      expect(ticketIcon).toBeInTheDocument();
      expect(ticketIcon).toHaveAttribute('src', 'test-file-stub');
      expect(screen.getByText(/Start from Rp/)).toBeInTheDocument();
    });

    it('should render event time with clock icon', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const clockIcon = screen.getByAltText('clock');
      expect(clockIcon).toBeInTheDocument();
      expect(clockIcon).toHaveAttribute('src', 'test-file-stub');
    });

    it('should show "No tickets available" when no ticket types', () => {
      const eventDataWithoutTickets = { ...mockEventData, ticketTypes: [] };
      render(
        <EventDetail
          data={eventDataWithoutTickets}
          onChooseTicket={mockOnChooseTicket}
        />
      );

      expect(screen.getByText('No tickets available')).toBeInTheDocument();
    });

    it('should display the lowest ticket price', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(screen.getByText(/Start from Rp 100,000/)).toBeInTheDocument(); // Should show first price
    });
  });

  describe('Event Description', () => {
    it('should render event description', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(
        screen.getByText(
          'This is a test event description that provides details about the event.'
        )
      ).toBeInTheDocument();
    });

    it('should have proper typography for description', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const description = screen.getByText(
        'This is a test event description that provides details about the event.'
      );
      expect(description).toHaveClass('body-undefined', 'text-white');
    });
  });

  describe('Choose Ticket Button', () => {
    it('should render choose ticket button on mobile', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const button = screen.getByText('Choose Ticket');
      expect(button).toBeInTheDocument();
    });

    it('should call onChooseTicket when button is clicked', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const button = screen.getByText('Choose Ticket');
      fireEvent.click(button);

      expect(mockOnChooseTicket).toHaveBeenCalledTimes(1);
    });

    it('should be hidden on desktop', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const buttonContainer = screen.getByText('Choose Ticket').closest('div');
      expect(buttonContainer).toHaveClass('lg:hidden');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive typography classes', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const title = screen.getByText('Test Event');
      expect(title).toHaveClass('text-[26px]', 'lg:text-[30px]');
    });

    it('should have responsive icon sizes', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const locationIcon = screen.getAllByAltText('location')[0];
      expect(locationIcon).toHaveClass(
        'h-[20px]',
        'w-[20px]',
        'lg:h-[24px]',
        'lg:w-[24px]'
      );
    });

    it('should have responsive text sizes', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const addressText = screen.getByText('Test Address, Jakarta');
      expect(addressText).toHaveClass('text-[12px]', 'lg:text-[14px]');
    });

    it('should have responsive padding', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const contentContainer = screen
        .getByText('Test Event')
        .closest('div').parentElement;
      expect(contentContainer).toHaveClass('py-8', 'lg:py-14');
    });

    it('should have responsive grid layout', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const gridContainer = document.querySelector(
        '.grid.gap-2.lg\\:grid-cols-2.lg\\:gap-16'
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass(
        'grid',
        'gap-2',
        'lg:grid-cols-2',
        'lg:gap-16'
      );
    });
  });

  describe('Typography and Styling', () => {
    it('should have correct heading typography', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const title = screen.getByText('Test Event');
      expect(title).toHaveClass('heading-undefined', 'text-white');

      const eventDetailsHeading = screen.getByText('Event Details');
      expect(eventDetailsHeading).toHaveClass('heading-22', 'text-white');
    });

    it('should have correct body typography', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const addressText = screen.getByText('Test Address, Jakarta');
      expect(addressText).toHaveClass('body-undefined', 'text-white');
    });

    it('should have proper spacing classes', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const title = screen.getByText('Test Event');
      expect(title).toHaveClass('mb-2', 'lg:mb-4');

      const eventDetailsHeading = screen.getByText('Event Details');
      expect(eventDetailsHeading).toHaveClass('mb-4');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for all images', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const locationIcons = screen.getAllByAltText('location');
      const ticketIcon = screen.getByAltText('ticket');
      const clockIcon = screen.getByAltText('clock');

      expect(locationIcons).toHaveLength(2); // Location and calendar icons
      expect(ticketIcon).toBeInTheDocument();
      expect(clockIcon).toBeInTheDocument();
    });

    it('should have proper button text', () => {
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      const button = screen.getByText('Choose Ticket');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('should format currency correctly', () => {
      const { formatRupiah } = require('@/utils/formatter');
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(formatRupiah).toHaveBeenCalledWith(100000); // First price
    });

    it('should format date correctly', () => {
      const { formatDate } = require('@/utils/formatter');
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(formatDate).toHaveBeenCalledWith('2024-01-01T10:00:00Z');
    });

    it('should format time correctly', () => {
      const { formatTime } = require('@/utils/formatter');
      render(
        <EventDetail data={mockEventData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(formatTime).toHaveBeenCalledWith('2024-01-01T10:00:00Z');
      expect(formatTime).toHaveBeenCalledWith('2024-01-01T18:00:00Z');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing event data gracefully', () => {
      const minimalData = {
        name: 'Test Event',
        address: 'Test Address',
        startDate: '2024-01-01T10:00:00Z',
        endDate: '2024-01-01T18:00:00Z',
        description: 'Test description',
        eventAssets: [],
        ticketTypes: [],
      };

      render(
        <EventDetail data={minimalData} onChooseTicket={mockOnChooseTicket} />
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('No tickets available')).toBeInTheDocument();
    });

    it('should handle missing onChooseTicket callback', () => {
      render(<EventDetail data={mockEventData} />);

      const button = screen.getByText('Choose Ticket');
      expect(button).toBeInTheDocument();

      // Should not throw error when clicked
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });
});
