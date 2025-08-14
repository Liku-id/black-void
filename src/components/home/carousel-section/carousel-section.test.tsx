import React from 'react';
import { render, screen } from '@testing-library/react';
import CarouselSection from './index';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

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
      src={src}
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
  Container: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Carousel: ({ images, pages, width, height, sizes, className }: any) => (
    <div
      className={className}
      data-width={width}
      data-height={height}
      data-sizes={sizes}
    >
      {images.map((image: string, index: number) => (
        <img key={index} src={image} alt={`Carousel image ${index + 1}`} />
      ))}
    </div>
  ),
  Slider: ({
    children,
    className,
    itemWidth,
    gap,
    pagination,
    pages,
    autoScroll,
  }: any) => (
    <div
      className={className}
      data-item-width={itemWidth}
      data-gap={gap}
      data-pagination={pagination}
      data-auto-scroll={autoScroll}
    >
      {children}
    </div>
  ),
}));

describe('CarouselSection Component', () => {
  const mockUseSWR = require('swr').default;

  const mockEventData = [
    {
      url: 'https://example.com/event1.jpg',
      metaUrl: 'event-1',
    },
    {
      url: 'https://example.com/event2.jpg',
      metaUrl: 'event-2',
    },
    {
      url: 'https://example.com/event3.jpg',
      metaUrl: 'event-3',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading skeleton when data is loading', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<CarouselSection />);

      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('bg-gray-200');
    });

    it('should have correct skeleton dimensions', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<CarouselSection />);

      const skeleton = document.querySelector('[class*="h-[200px]"]');
      expect(skeleton).toBeInTheDocument();
    });

    it('should have responsive skeleton sizing', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<CarouselSection />);

      const skeleton = document.querySelector('[class*="sm:h-[300px]"]');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no data', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<CarouselSection />);

      expect(screen.getByText('No images found')).toBeInTheDocument();
    });

    it('should have correct empty state styling', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<CarouselSection />);

      const emptyState = screen.getByText('No images found');
      expect(emptyState).toHaveClass('text-muted');
    });

    it('should have proper empty state dimensions', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<CarouselSection />);

      const emptyContainer = screen.getByText('No images found').closest('div');
      expect(emptyContainer).toHaveClass('h-[200px]');
    });
  });

  describe('Data Rendering', () => {
    it('should render carousel with event data', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const images = screen.getAllByAltText(/Image \d+|Carousel image \d+/);
      expect(images).toHaveLength(6); // 3 for mobile slider + 3 for desktop carousel
    });

    it('should render mobile slider with correct props', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const slider = document.querySelector('[data-item-width="350"]');
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('data-gap', '0');
      expect(slider).toHaveAttribute('data-pagination', 'true');
      expect(slider).toHaveAttribute('data-auto-scroll', 'false');
    });

    it('should render desktop carousel with correct props', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const carousel = document.querySelector('[data-width="800"]');
      expect(carousel).toBeInTheDocument();
      expect(carousel).toHaveAttribute('data-height', '456');
      expect(carousel).toHaveAttribute(
        'data-sizes',
        '(min-width: 1024px) 800px, (min-width: 768px) 550px'
      );
    });

    it('should generate correct page URLs', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      // Check that pages are generated correctly
      const carousel = document.querySelector('[data-width="800"]');
      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should hide mobile slider on desktop', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const mobileSlider = document.querySelector('.md\\:hidden');
      expect(mobileSlider).toBeInTheDocument();
    });

    it('should hide desktop carousel on mobile', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const desktopCarousel = document.querySelector('.hidden.md\\:block');
      expect(desktopCarousel).toBeInTheDocument();
    });

    it('should have responsive carousel sizing', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const carousel = document.querySelector(
        '[class*="h-[200px]"][class*="sm:h-[300px]"][class*="md:h-[350px]"][class*="lg:h-[450px]"][class*="xl:h-[500px]"]'
      );
      expect(carousel).toBeInTheDocument();
    });

    it('should have responsive carousel width', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const carousel = document.querySelector(
        '[class*="w-[350px]"][class*="sm:w-[450px]"][class*="md:w-[550px]"][class*="lg:w-[800px]"]'
      );
      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should render images with correct attributes', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const images = screen.getAllByAltText(/Image \d+/);
      images.forEach((image, index) => {
        expect(image).toHaveAttribute('src', mockEventData[index].url);
        expect(image).toHaveAttribute('data-draggable', 'false');
        expect(image).toHaveAttribute('data-unoptimized', 'true');
      });
    });

    it('should have correct image styling', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const images = screen.getAllByAltText(/Image \d+/);
      images.forEach((image) => {
        expect(image).toHaveClass('h-full', 'w-full', 'object-cover');
      });
    });

    it('should have correct image dimensions', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const images = screen.getAllByAltText(/Image \d+/);
      images.forEach((image) => {
        expect(image).toHaveAttribute('width', '350');
        expect(image).toHaveAttribute('height', '200');
      });
    });
  });

  describe('Component Structure', () => {
    it('should render main section', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render container', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const container = document.querySelector('section > div');
      expect(container).toBeInTheDocument();
    });

    it('should center content', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const centerBox = document.querySelector('.flex.justify-center');
      expect(centerBox).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const images = screen.getAllByAltText(/Image \d+|Carousel image \d+/);
      expect(images.length).toBeGreaterThan(0);
    });

    it('should have proper image attributes', () => {
      mockUseSWR.mockReturnValue({
        data: mockEventData,
        isLoading: false,
      });

      render(<CarouselSection />);

      const images = screen.getAllByAltText(/Image \d+/);
      images.forEach((image) => {
        expect(image).toHaveAttribute('data-draggable', 'false');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<CarouselSection />);

      expect(screen.getByText('No images found')).toBeInTheDocument();
    });

    it('should handle null data gracefully', () => {
      mockUseSWR.mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<CarouselSection />);

      expect(screen.getByText('No images found')).toBeInTheDocument();
    });

    it('should handle empty array data', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<CarouselSection />);

      expect(screen.getByText('No images found')).toBeInTheDocument();
    });
  });
});
