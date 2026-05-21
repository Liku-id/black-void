import { render, screen, waitFor } from '@testing-library/react';
import ScannerPage from './page';

// Mocks
jest.mock('axios');
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="icon-check">CheckCircle</div>,
  AlertCircle: () => <div data-testid="icon-alert">AlertCircle</div>,
  XCircle: () => <div data-testid="icon-x">XCircle</div>,
  QrCode: () => <div data-testid="icon-qrcode">QrCode</div>,
  RotateCcw: () => <div data-testid="icon-rotate">RotateCcw</div>,
}));

jest.mock('@/components/scanner/qr-scanner', () => () => <div data-testid="qr-scanner">QRCodeScanner</div>);
jest.mock('@/components/scanner/info-card', () => () => <div data-testid="info-card">TicketInfoCard</div>);

// Mock @/components barrel file components used in ScannerPage
jest.mock('@/components', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  Typography: ({ children }: any) => <span>{children}</span>,
  Modal: ({ children, open }: any) => open ? <div data-testid="modal">{children}</div> : null,
}));

describe('ScannerPage', () => {
  it('renders correctly', () => {
    render(<ScannerPage />);
    expect(screen.getByTestId('qr-scanner')).toBeInTheDocument();
    expect(screen.getByText(/Initializing Scanner.../i)).toBeInTheDocument();
  });

  it('shows scanner initializing state', () => {
    render(<ScannerPage />);
    expect(screen.getByText(/Please allow camera access/i)).toBeInTheDocument();
  });
});
