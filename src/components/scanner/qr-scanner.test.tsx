import { render, screen, waitFor } from '@testing-library/react';
import QRCodeScanner from './qr-scanner';

// Mocks
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockClear = jest.fn();

jest.mock('html5-qrcode', () => {
  return {
    Html5Qrcode: jest.fn().mockImplementation(() => ({
      start: mockStart,
      stop: mockStop,
      clear: mockClear,
    })),
  };
});

// Mock static method getCameras
const mockGetCameras = jest.fn().mockResolvedValue([{ id: 'cam1', label: 'Back Camera' }]);
(require('html5-qrcode').Html5Qrcode as any).getCameras = mockGetCameras;

describe('QRCodeScanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders scanner container', () => {
    render(<QRCodeScanner onSuccess={jest.fn()} cameraStarted={true} />);
    // Use container query or check for ID "qr-reader"
    // Since IDs aren't heavily used in queries, verify structure or check if mock was called.
    const scanner = document.getElementById('qr-reader');
    expect(scanner).toBeInTheDocument();
  });

  it('initializes scanner when cameraStarted is true', async () => {
    render(<QRCodeScanner onSuccess={jest.fn()} cameraStarted={true} />);

    await waitFor(() => {
      expect(require('html5-qrcode').Html5Qrcode).toHaveBeenCalled();
      expect(mockGetCameras).toHaveBeenCalled();
      expect(mockStart).toHaveBeenCalled();
    });
  });

  it('stops scanner when component unmounts', () => {
    const { unmount } = render(<QRCodeScanner onSuccess={jest.fn()} cameraStarted={true} />);
    unmount();
    expect(mockStop).toHaveBeenCalled();
  });
});
