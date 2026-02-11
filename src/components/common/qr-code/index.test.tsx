import { render, screen, waitFor } from '@testing-library/react';
import { QRCode } from './index';

// Mock qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockcode'),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('QRCode', () => {
  it('renders QR code when value is provided', async () => {
    render(<QRCode value="test-data" />);

    await waitFor(() => {
      const img = screen.getByAltText('QR Code');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/png;base64,mockcode');
    });
  });

  it('shows error when no value', async () => {
    render(<QRCode value="" />);
    expect(await screen.findByText('QR code not available')).toBeInTheDocument();
  });
});
