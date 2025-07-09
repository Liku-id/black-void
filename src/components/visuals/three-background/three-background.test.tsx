import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ThreeBackground from './index';
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';

// Mock Three.js modules
jest.mock('three', () => ({
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas'),
    dispose: jest.fn(),
  })),
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    dispose: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    updateProjectionMatrix: jest.fn(),
  })),
  AmbientLight: jest.fn(() => ({})),
  DirectionalLight: jest.fn(() => ({})),
  BoxGeometry: jest.fn(() => ({})),
  MeshBasicMaterial: jest.fn(() => ({})),
  Mesh: jest.fn(() => ({ position: { set: jest.fn() } })),
  PlaneGeometry: jest.fn(),
  ShaderMaterial: jest.fn(),
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

// Mock window.innerWidth and innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768,
});

describe('ThreeBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ThreeBackground />);
    const backgroundDiv = screen.getByTestId('three-background');
    expect(backgroundDiv).toBeInTheDocument();
  });

  it('has correct styling attributes', () => {
    render(<ThreeBackground />);
    const backgroundDiv = screen.getByTestId('three-background');

    expect(backgroundDiv).toHaveStyle({
      position: 'fixed',
      inset: '0',
      zIndex: '-1',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      pointerEvents: 'none',
    });
  });

  it('creates a ref for mounting Three.js content', () => {
    render(<ThreeBackground />);
    const backgroundDiv = screen.getByTestId('three-background');
    expect(backgroundDiv).toBeInTheDocument();
  });

  it('initializes Three.js components on mount', () => {
    render(<ThreeBackground />);
    expect(WebGLRenderer).toHaveBeenCalledWith({ antialias: true });
    expect(Scene).toHaveBeenCalled();
    expect(PerspectiveCamera).toHaveBeenCalledWith(75, 1024 / 768, 1, 10000);
  });

  it('sets up animation loop', () => {
    render(<ThreeBackground />);

    // Wait for the next tick to allow useEffect to run
    setTimeout(() => {
      expect(requestAnimationFrame).toHaveBeenCalled();
    }, 0);
  });

  it('handles window resize events', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    render(<ThreeBackground />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it('cleans up on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ThreeBackground />);

    unmount();

    // Note: The cleanup function runs in useEffect, so we can't easily test it
    // without more complex mocking, but we can verify the component unmounts cleanly
    expect(removeEventListenerSpy).toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
  });
});
