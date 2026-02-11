import { render, screen } from '@testing-library/react';
import CarouselSection from './';
import '@testing-library/jest-dom';

// Mock Next.js Image
jest.mock('next/image', () => ({ unoptimized, ...props }: any) => <img {...props} />);

// Mock useResponsive
jest.mock('@/lib/use-responsive', () => ({
  useResponsive: jest.fn(),
}));

// Mock useSWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import useSWR from 'swr';

const mockItems = [
  { url: 'https://dummyimage.com/900x505/FF6B6B/FFFFFF.png&text=Event+1', metaUrl: 'event-1', status: 'on_going' },
  { url: 'https://dummyimage.com/900x505/4ECDC4/FFFFFF.png&text=Event+2', metaUrl: 'event-2', status: 'on_going' },
  { url: 'https://dummyimage.com/900x505/45B7D1/FFFFFF.png&text=Event+3', metaUrl: 'event-3', status: 'on_going' },
];

describe('CarouselSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Slider (mobile) with correct images and classes', () => {
    const { useResponsive } = require('@/lib/use-responsive');
    useResponsive.mockReturnValue({ sm: false }); // isMobile
    render(<CarouselSection items={mockItems} />);

    // Should render Slider
    const imgs = screen
      .getAllByRole('img')
      .filter(img =>
        ['Image 1', 'Image 2', 'Image 3'].includes(
          (img as HTMLImageElement).alt
        )
      );
    expect(imgs).toHaveLength(mockItems.length);
    mockItems.forEach((item, i) => {
      expect(screen.getByAltText(`Image ${i + 1}`)).toHaveAttribute('src', item.url);
    });
    // Should have correct class for width/height on the slider wrapper
    // Cari parent yang punya class w-[350px]
    let parent = imgs[0].parentElement;
    while (parent && !parent.classList.contains('w-[350px]')) {
      parent = parent.parentElement;
    }
    expect(parent).toBeTruthy();
    expect(parent).toHaveClass('w-[350px]');
  });

  it('renders Carousel (desktop) with correct props', () => {
    const { useResponsive } = require('@/lib/use-responsive');
    useResponsive.mockReturnValue({ sm: true, md: true, lg: true, xl: true }); // isDesktop
    render(<CarouselSection items={mockItems} />);

    // Should render Carousel (not Slider)
    // Carousel renders images as background or via props, so check for class
    // Note: The previous test might have been checking for a specific structure that might differ slightly based on Carousel implementation
    // But assuming Carousel uses the className passed to it:
    const candidates = screen.getAllByText((content, element) => {
      return (
        !!element &&
        element.className.includes('w-[900px]') &&
        element.className.includes('h-[500px]')
      );
    });
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toBeInTheDocument();
  });

  it('renders correct class for md viewport', () => {
    const { useResponsive } = require('@/lib/use-responsive');
    useResponsive.mockReturnValue({ sm: true, md: true, lg: false, xl: false });
    render(<CarouselSection items={mockItems} />);
    // md: width 550, height 350
    const candidates = screen.getAllByText((content, element) => {
      return (
        !!element &&
        element.className.includes('w-[550px]') &&
        element.className.includes('h-[350px]')
      );
    });
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toBeInTheDocument();
  });

  it('renders correct class for lg viewport', () => {
    const { useResponsive } = require('@/lib/use-responsive');
    useResponsive.mockReturnValue({ sm: true, md: true, lg: true, xl: false });
    render(<CarouselSection items={mockItems} />);
    // lg: width 800, height 450
    const candidates = screen.getAllByText((content, element) => {
      return (
        !!element &&
        element.className.includes('w-[800px]') &&
        element.className.includes('h-[450px]')
      );
    });
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toBeInTheDocument();
  });

  it('renders correct class for sm viewport', () => {
    const { useResponsive } = require('@/lib/use-responsive');
    useResponsive.mockReturnValue({
      sm: true,
      md: false,
      lg: false,
      xl: false,
    });
    render(<CarouselSection items={mockItems} />);
    // sm: width 450, height 300
    const el = screen.getByText((content, element) => {
      return (
        !!element &&
        element.className.includes('w-[450px]') &&
        element.className.includes('h-[300px]')
      );
    });
    expect(el).toBeInTheDocument();
  });
});
