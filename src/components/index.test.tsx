import { render, screen } from '@testing-library/react';
import Header from './layout/header';
import ThreeBackground from './visuals/three-background';
import { Typography } from '../components';
import * as Components from './index';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
    priority,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-priority={priority}
    />
  ),
}));

// Mock the logo import
jest.mock('@/assets/logo/logo.svg', () => 'mocked-logo.svg');

// Mock Three.js modules
jest.mock('three', () => ({
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  PlaneGeometry: jest.fn().mockImplementation(() => ({})),
  ShaderMaterial: jest.fn(),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
  })),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
    attributes: {
      position: {
        array: new Float32Array(100),
        needsUpdate: false,
        setY: jest.fn(),
      },
      color: {
        array: new Float32Array(100),
        needsUpdate: false,
        setX: jest.fn(),
        setY: jest.fn(),
        setZ: jest.fn(),
      },
    },
  })),
  BufferAttribute: jest.fn(),
  PointsMaterial: jest.fn(),
  Points: jest.fn().mockImplementation(() => ({
    rotation: { x: 0, y: 0 },
  })),
  DoubleSide: 'DoubleSide',
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => {
  setTimeout(cb, 0);
  return 1;
});

describe('Component Integration Tests', () => {
  it('renders Header with correct structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const logoImages = screen.getAllByAltText('Logo');
    expect(logoImages[0]).toBeInTheDocument();
    expect(logoImages[0]).toHaveAttribute('src', 'mocked-logo.svg');
  });

  it('renders ThreeBackground with correct styling', () => {
    render(<ThreeBackground />);

    const background = screen.getByTestId('three-background');
    expect(background).toBeInTheDocument();
    expect(background).toHaveStyle({
      position: 'fixed',
      inset: '0',
      zIndex: '-1',
    });
  });

  it('renders Typography with all variants', () => {
    render(
      <div>
        <Typography as="h1" type="heading" size={64}>
          Heading
        </Typography>
        <Typography type="body" size={16}>
          Body Text
        </Typography>
      </div>
    );

    const heading = screen.getByRole('heading', {
      level: 1,
    });
    expect(heading).toHaveTextContent('Heading');
    expect(heading).toHaveClass('font-bebas', 'text-[64px]');

    const bodyText = screen.getByText('Body Text');
    expect(bodyText).toHaveClass('font-onest', 'text-[16px]');
  });

  it('combines Header and Typography components', () => {
    render(
      <div>
        <Header />
        <Typography as="h1" type="heading">
          Page Title
        </Typography>
      </div>
    );

    // Header should be present
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const logoImages = screen.getAllByAltText('Logo');
    expect(logoImages[0]).toBeInTheDocument();

    // Typography should be present
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Page Title');
  });

  it('handles responsive design classes correctly', () => {
    render(
      <div className="min-h-screen bg-black text-white">
        <Header />
        <Typography size={24} color="text-white">
          Responsive Text
        </Typography>
      </div>
    );

    const container = screen.getByText('Responsive Text').parentElement;
    expect(container).toHaveClass('min-h-screen', 'bg-black', 'text-white');

    const text = screen.getByText('Responsive Text');
    expect(text).toHaveClass('text-[24px]', 'text-white');
  });
});

describe('components/index exports', () => {
  it('exports Typography', () => {
    expect(Components.Typography).toBeDefined();
  });
  it('exports Box', () => {
    expect(Components.Box).toBeDefined();
  });
  it('exports TextField', () => {
    expect(Components.TextField).toBeDefined();
  });
  it('exports Header', () => {
    expect(Components.Header).toBeDefined();
  });
  it('exports ThreeBackground', () => {
    expect(Components.ThreeBackground).toBeDefined();
  });
});
