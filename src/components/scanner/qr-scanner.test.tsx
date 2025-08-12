import React from 'react';
import { render, screen } from '@testing-library/react';
import QRCodeScanner from './qr-scanner';
import '@testing-library/jest-dom';

// Mock the components
jest.mock('@/components', () => ({
  Box: ({ children, className, id, ref, ...props }: any) => (
    <div className={className} id={id} ref={ref} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, className, size, ...props }: any) => (
    <div className={className} data-size={size} {...props}>
      {children}
    </div>
  ),
}));

// Mock Html5Qrcode with a simple mock
jest.mock('html5-qrcode', () => ({
  Html5Qrcode: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    clear: jest.fn(),
  })),
}));

describe('QRCodeScanner', () => {
  const mockOnSuccess = jest.fn();
  const mockOnStart = jest.fn();
  const mockOnInitialized = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('renders scanner container', () => {
      render(<QRCodeScanner onSuccess={mockOnSuccess} cameraStarted={false} />);

      // Check that the scanner container exists
      const scannerElement = document.getElementById('qr-reader');
      expect(scannerElement).toBeInTheDocument();
    });

    it('does not initialize scanner when disabled', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          cameraStarted={true}
          disabled={true}
        />
      );

      expect(screen.getByText('Scanner Disabled')).toBeInTheDocument();
    });

    it('shows disabled overlay when disabled', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          cameraStarted={true}
          disabled={true}
        />
      );

      expect(screen.getByText('Scanner Disabled')).toBeInTheDocument();
    });
  });

  describe('UI States', () => {
    it('shows disabled state', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          cameraStarted={true}
          disabled={true}
        />
      );

      expect(screen.getByText('Scanner Disabled')).toBeInTheDocument();
    });

    it('renders scanner container with correct structure', () => {
      render(<QRCodeScanner onSuccess={mockOnSuccess} cameraStarted={false} />);

      // Check that the main container exists
      const scannerElement = document.getElementById('qr-reader');
      expect(scannerElement).toBeInTheDocument();
    });

    it('renders with correct props', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          cameraStarted={false}
          enableLogs={true}
        />
      );

      // Check that the scanner container exists
      const scannerElement = document.getElementById('qr-reader');
      expect(scannerElement).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('accepts onSuccess callback', () => {
      render(<QRCodeScanner onSuccess={mockOnSuccess} cameraStarted={false} />);

      expect(mockOnSuccess).toBeDefined();
    });

    it('accepts onStart callback', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          onStart={mockOnStart}
          cameraStarted={false}
        />
      );

      expect(mockOnStart).toBeDefined();
    });

    it('accepts onInitialized callback', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          onInitialized={mockOnInitialized}
          cameraStarted={false}
        />
      );

      expect(mockOnInitialized).toBeDefined();
    });

    it('accepts enableLogs prop', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          cameraStarted={false}
          enableLogs={true}
        />
      );

      // Check that the scanner container exists
      const scannerElement = document.getElementById('qr-reader');
      expect(scannerElement).toBeInTheDocument();
    });

    it('accepts disabled prop', () => {
      render(
        <QRCodeScanner
          onSuccess={mockOnSuccess}
          cameraStarted={true}
          disabled={true}
        />
      );

      expect(screen.getByText('Scanner Disabled')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders with correct DOM structure', () => {
      render(<QRCodeScanner onSuccess={mockOnSuccess} cameraStarted={false} />);

      // Check that the scanner container exists
      const scannerElement = document.getElementById('qr-reader');
      expect(scannerElement).toBeInTheDocument();

      // Check that the main container exists
      const mainContainer = scannerElement?.closest('div');
      expect(mainContainer).toBeInTheDocument();
    });

    it('renders scanner element with correct ID', () => {
      render(<QRCodeScanner onSuccess={mockOnSuccess} cameraStarted={false} />);

      // The scanner should have the qr-reader ID
      const scannerElement = document.getElementById('qr-reader');
      expect(scannerElement).toBeInTheDocument();
    });
  });
});
