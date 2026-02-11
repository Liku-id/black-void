import { render, screen } from '@testing-library/react';
import EventFundingPage from './page';

// Mock child components
jest.mock('@/components/event-funding/hero-section', () => () => <div data-testid="hero-section">HeroSection</div>);
jest.mock('@/components/event-funding/collaboration-section', () => () => <div data-testid="collaboration-section">CollaborationSection</div>);
jest.mock('@/components/event-funding/why-choose-section', () => () => <div data-testid="why-choose-section">WhyChooseSection</div>);
jest.mock('@/components/event-funding/how-it-works-section', () => () => <div data-testid="how-it-works-section">HowItWorksSection</div>);
jest.mock('@/components/event-funding/funding-requirements-section', () => () => <div data-testid="funding-requirements-section">FundingRequirementsSection</div>);
jest.mock('@/components/event-funding/funding-form-section', () => () => <div data-testid="funding-form-section">FundingFormSection</div>);
jest.mock('@/components/event-funding/event-types-section', () => () => <div data-testid="event-types-section">EventTypesSection</div>);
jest.mock('@/components/home/faq-section', () => ({ data }: { data: any[] }) => (
  <div data-testid="faq-section" data-item-count={data?.length}>
    FAQSection
  </div>
));

describe('EventFundingPage', () => {
  it('renders all sections correctly', () => {
    render(<EventFundingPage />);

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('collaboration-section')).toBeInTheDocument();
    expect(screen.getByTestId('event-types-section')).toBeInTheDocument();
    expect(screen.getByTestId('why-choose-section')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works-section')).toBeInTheDocument();
    expect(screen.getByTestId('funding-requirements-section')).toBeInTheDocument();
    expect(screen.getByTestId('funding-form-section')).toBeInTheDocument();

    // Verify FAQ section receives data
    const faqSection = screen.getByTestId('faq-section');
    expect(faqSection).toBeInTheDocument();
    expect(faqSection).toHaveAttribute('data-item-count', '15'); // Based on file content, there are 15 items
  });
});
