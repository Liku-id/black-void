import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { Carousel } from './index';
import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock carousel arrow icon
jest.mock('@/assets/icons/carousel-arrow.svg', () => 'mocked-arrow.svg');

const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
];

// Helper function to get the current active image
const getCurrentImage = () => {
  const images = screen.getAllByAltText('');
  return images.find(img => img.classList.contains('opacity-100')) || images[0];
};

describe('Carousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders carousel with images', () => {
    render(<Carousel images={mockImages} />);

    // Check if current image is displayed
    const currentImage = getCurrentImage();
    expect(currentImage).toBeInTheDocument();
    expect(currentImage).toHaveAttribute('src', mockImages[0]);
  });

  it('renders navigation arrows', () => {
    render(<Carousel images={mockImages} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('renders pagination dots', () => {
    render(<Carousel images={mockImages} />);

    const paginationButtons = screen.getAllByRole('button');
    // Should have 3 pagination dots + 2 navigation arrows = 5 buttons
    expect(paginationButtons).toHaveLength(5);
  });

  it('navigates to next slide when next button is clicked', async () => {
    render(<Carousel images={mockImages} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Advance timers to complete animation
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[1]);
    });
  });

  it('navigates to previous slide when prev button is clicked', async () => {
    render(<Carousel images={mockImages} />);

    // First go to second slide
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[1]);
    });

    // Then go back
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[0]);
    });
  });

  it('wraps around when navigating past last slide', async () => {
    render(<Carousel images={mockImages} />);

    // Go to last slide
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // index 1
    act(() => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(nextButton); // index 2
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[2]);
    });

    // Go to next (should wrap to index 0)
    fireEvent.click(nextButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[0]);
    });
  });

  it('wraps around when navigating before first slide', async () => {
    render(<Carousel images={mockImages} />);

    // Go back from first slide (should wrap to last)
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[2]);
    });
  });

  it('navigates to specific slide when pagination dot is clicked', async () => {
    render(<Carousel images={mockImages} />);

    // Get all pagination buttons (excluding navigation arrows)
    const paginationButtons = screen.getAllByRole('button').slice(2); // Skip nav arrows

    // Click on second pagination dot
    fireEvent.click(paginationButtons[1]);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[1]);
    });
  });

  it('applies custom className', () => {
    const customClass = 'custom-carousel-class';
    render(<Carousel images={mockImages} className={customClass} />);

    const carousel = getCurrentImage().closest('.flex');
    expect(carousel).toHaveClass(customClass);
  });

  it('disables animation when animate prop is false', () => {
    render(<Carousel images={mockImages} animate={false} />);

    // When animate is false, there should be no animation-related elements
    const currentImage = getCurrentImage();
    expect(currentImage).toHaveClass(
      'absolute h-full w-full object-cover cursor-pointer'
    );
    expect(currentImage).not.toHaveClass('transition-opacity');
  });



  it('prevents navigation during animation', async () => {
    render(<Carousel images={mockImages} animate={true} />);

    const nextButton = screen.getByRole('button', { name: /next/i });

    // Click multiple times rapidly
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Should only advance by one step due to animation lock
    await waitFor(() => {
      const currentImage = getCurrentImage();
      expect(currentImage).toHaveAttribute('src', mockImages[1]);
    });
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<Carousel images={mockImages} animate={true} />);

    // Trigger animation
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  // Additional tests for 100% coverage
  it('prevents navigation when clicking on current slide', () => {
    render(<Carousel images={mockImages} />);

    // Get all pagination buttons (excluding navigation arrows)
    const paginationButtons = screen.getAllByRole('button').slice(2);

    // Click on current slide (first dot)
    fireEvent.click(paginationButtons[0]);

    // Should still be on first image
    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[0]);
  });

  it('handles navigation when animate is false', () => {
    render(<Carousel images={mockImages} animate={false} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should immediately change without animation
    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[1]);
  });

  it('handles navigation to previous slide when animate is false', () => {
    render(<Carousel images={mockImages} animate={false} />);

    // First go to second slide
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Then go back
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    // Should immediately go back to first image
    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[0]);
  });

  it('handles navigation to specific slide when animate is false', () => {
    render(<Carousel images={mockImages} animate={false} />);

    const paginationButtons = screen.getAllByRole('button').slice(2);
    fireEvent.click(paginationButtons[2]); // Go to last slide

    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[2]);
  });



  it('handles navigation to previous slide when current index is 0', () => {
    render(<Carousel images={mockImages} animate={false} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    // Should wrap to last image
    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[2]);
  });

  it('handles navigation to next slide when current index is last', () => {
    render(<Carousel images={mockImages} animate={false} />);

    // Go to last slide
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Go to next (should wrap to first)
    fireEvent.click(nextButton);

    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[0]);
  });

  // Tests for remaining uncovered lines
  it('handles navigation to slide with index greater than current', () => {
    render(<Carousel images={mockImages} animate={false} />);

    const paginationButtons = screen.getAllByRole('button').slice(2);
    fireEvent.click(paginationButtons[2]); // Go to last slide (index 2)

    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[2]);
  });

  it('handles navigation to slide with index less than current', () => {
    render(<Carousel images={mockImages} animate={false} />);

    // First go to second slide
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Then go back to first slide via pagination
    const paginationButtons = screen.getAllByRole('button').slice(2);
    fireEvent.click(paginationButtons[0]); // Go to first slide (index 0)

    const currentImage = getCurrentImage();
    expect(currentImage).toHaveAttribute('src', mockImages[0]);
  });
});
