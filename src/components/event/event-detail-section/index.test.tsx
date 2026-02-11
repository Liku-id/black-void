import { render, screen, fireEvent } from '@testing-library/react';
import EventDetail from './index';

// Mocks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/components', () => ({
  Box: ({ children, className }: any) => <div className={className}>{children}</div>,
  Typography: ({ children, className, onClick, dangerouslySetInnerHTML }: any) => (
    <div className={className} onClick={onClick} dangerouslySetInnerHTML={dangerouslySetInnerHTML}>{children}</div>
  ),
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  Slider: ({ children }: any) => <div data-testid="slider">{children}</div>,
}));

jest.mock('@/components/common/carousel', () => ({
  Carousel: () => <div data-testid="carousel">Carousel</div>
}));

jest.mock('@/utils/formatter', () => ({
  formatTime: () => '10:00',
  formatStrToHTML: (str: string) => str,
  formatDate: () => '01 Jan 2024',
}));

describe('EventDetail', () => {
  const mockOnChooseTicket = jest.fn();
  const eventData = {
    name: 'Event Name',
    description: 'Event Description',
    address: 'Event Address',
    startDate: '2024-01-01T10:00',
    endDate: '2024-01-01T12:00',
    eventAssets: [] as any[], // No assets initially
    lowestTicketPrice: 10000,
  };

  it('renders event details', () => {
    render(<EventDetail data={eventData} onChooseTicket={mockOnChooseTicket} />);

    expect(screen.getByText('Event Name')).toBeInTheDocument();
    expect(screen.getByText('Event Address')).toBeInTheDocument();
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByText('Event Description')).toBeInTheDocument();
  });

  it('renders "No images available" when no assets', () => {
    render(<EventDetail data={eventData} onChooseTicket={mockOnChooseTicket} />);
    // There are two "No images available" blocks (mobile/desktop), checking for at least one
    expect(screen.getAllByText('No images available').length).toBeGreaterThan(0);
  });

  it('renders carousel when assets present', () => {
    const dataWithAssets = {
      ...eventData,
      eventAssets: [
        { asset: { url: 'img1.jpg' } }
      ]
    };
    render(<EventDetail data={dataWithAssets} onChooseTicket={mockOnChooseTicket} />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });
});
