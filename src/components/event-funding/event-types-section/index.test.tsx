import { render, screen, fireEvent } from '@testing-library/react';
import EventTypesSection from './index';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('EventTypesSection', () => {
  it('renders all event types correctly', () => {
    render(<EventTypesSection />);

    expect(screen.getByText(/Built for Various Event Types/i)).toBeInTheDocument();

    // Check specific event type texts
    // Check specific event type texts (handling duplicates for mobile/desktop layouts)
    expect(screen.getAllByText(/Sports & running events/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Community & creative events/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Conferences & exhibitions/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Music & entertainment events/i)[0]).toBeInTheDocument();
  });

  it('renders Start Funding button', () => {
    render(<EventTypesSection />);
    expect(screen.getByText(/Start Funding/i)).toBeInTheDocument();
  });
  it('scrolls to funding form on button click', () => {
    render(<EventTypesSection />);
    const button = screen.getByText(/Start Funding/i);

    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
    } as any);

    fireEvent.click(button);
    expect(document.getElementById).toHaveBeenCalledWith('funding-form');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
