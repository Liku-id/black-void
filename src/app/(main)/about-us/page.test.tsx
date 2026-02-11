import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AboutUsPage from './page';

// Mock next/image to avoid issues with standard Image component in tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock FAQSection since it comes from outside and might have its own complexity/fetching
jest.mock('@/components/home/faq-section', () => {
  return function MockFAQSection() {
    return <div data-testid="faq-section">FAQ Section</div>;
  };
});

// We can also mock internal components if we want to test the page in isolation,
// but for high coverage of the folder, rendering them is better.
// However, if we want to ensure 85% coverage of the specific *page* file, integration is fine.
// If the user meant 85% coverage of the *components* too, then integration is definitely the way.

describe('AboutUsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections correctly', () => {
    render(<AboutUsPage />);

    // Hero Section
    expect(screen.getByText(/All in One Ticketing & Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Management System Platform/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore Wukong/i })).toBeInTheDocument();

    // Who We Are Section
    expect(screen.getByRole('heading', { name: /Who we are\?/i })).toBeInTheDocument();
    // Use a substring that doesn't span complex HTML/newlines if possible, or use a function matcher
    expect(screen.getByText(/true change begins when people come together/i)).toBeInTheDocument();

    // USP Section
    expect(screen.getByText(/Manage tickets effortlessly/i)).toBeInTheDocument();
    // Check for some USP titles - at least one should be visible (Mobile or Desktop or both)
    const fastAndEasy = screen.getAllByText(/fast & easy buyer check-in/i);
    expect(fastAndEasy.length).toBeGreaterThan(0);

    // Features Section
    expect(screen.getByText(/All in one feature for your event marketing/i)).toBeInTheDocument();
    expect(screen.getByText(/Special leads Requirement/i)).toBeInTheDocument();

    // Financial Section
    expect(screen.getByText(/Transparent and Reliable Financial Reporting/i)).toBeInTheDocument();
    expect(screen.getByText(/Competitive Fee/i)).toBeInTheDocument();

    // CTA Section
    expect(screen.getByText(/START YOUR EVENT HERE!/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Create My Event/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Talk to Our Team/i })).toBeInTheDocument();

    // FAQ Section (Mocked)
    expect(screen.getByTestId('faq-section')).toBeInTheDocument();
  });

  it('handles USP Section swipe logic (mobile)', () => {
    render(<AboutUsPage />);

    // Initial State: "fast & easy" (item 0) is active.
    // "comprehensive financial report" (item 1) is next.

    // Check initial counts
    const initialItem0Count = screen.queryAllByText(/fast & easy buyer check-in/i).length;
    const initialItem1Count = screen.queryAllByText(/comprehensive financial report/i).length;

    // We expect Item 0 to be present (active in mobile).
    expect(initialItem0Count).toBeGreaterThan(0);

    // Find the swipe target (likely the Item 0 element). 
    // We target the one that looks like it's in the mobile container (md:hidden parent) if possible, 
    // or just try swiping on the first one found.
    const item0Elements = screen.getAllByText(/fast & easy buyer check-in/i);
    const target = item0Elements[0].parentElement?.parentElement?.parentElement || item0Elements[0];

    // --- Left Swipe (Next) ---
    fireEvent.touchStart(target, { targetTouches: [{ clientX: 300 }] });
    fireEvent.touchMove(target, { targetTouches: [{ clientX: 200 }] }); // Moved 100px left
    fireEvent.touchEnd(target, { targetTouches: [{ clientX: 200 }] });

    // After swipe next:
    // Item 0 ("fast & easy") should be inactive in mobile.
    // Item 1 ("comprehensive") should be active in mobile.

    const newItem0Count = screen.queryAllByText(/fast & easy buyer check-in/i).length;
    const newItem1Count = screen.queryAllByText(/comprehensive financial report/i).length;

    // Logic: 
    // If Desktop is rendering (counts were 2), they stay 2 (static).
    // If Mobile IS rendering: 
    //   Item 0 count should DECREASE by 1 (removed from mobile view).
    //   Item 1 count should INCREASE by 1 (added to mobile view).

    // However, if Desktop IS NOT rendering (counts were 1 and 0):
    //   Item 0 count: 1 -> 0
    //   Item 1 count: 0 -> 1

    // So in both cases:
    // newItem0Count < initialItem0Count
    // newItem1Count > initialItem1Count (if it was 0, now 1. If it was 1, now 2)

    // One edge case: if only 1 exists initially (Mobile only), afterwards "fast & easy" might disappear completely (0 count).
    // So let's check the deltas.

    expect(newItem0Count).toBeLessThan(initialItem0Count); // Should drop
    expect(newItem1Count).toBeGreaterThan(initialItem1Count); // Should rise


    // --- Right Swipe (Previous) ---
    // Now Active: Item 1 ("comprehensive"). We swipe right on it to go back to Item 0.
    const item1Elements = screen.getAllByText(/comprehensive financial report/i);
    const targetBack = item1Elements[0].parentElement?.parentElement?.parentElement || item1Elements[0];

    fireEvent.touchStart(targetBack, { targetTouches: [{ clientX: 200 }] });
    fireEvent.touchMove(targetBack, { targetTouches: [{ clientX: 300 }] }); // +100px
    fireEvent.touchEnd(targetBack, { targetTouches: [{ clientX: 300 }] });

    const finalItem0Count = screen.queryAllByText(/fast & easy buyer check-in/i).length;
    const finalItem1Count = screen.queryAllByText(/comprehensive financial report/i).length;

    // Should return to initial state
    // Item 0 rises, Item 1 drops
    expect(finalItem0Count).toBeGreaterThan(newItem0Count);
    expect(finalItem1Count).toBeLessThan(newItem1Count);
  });

  it('handles USP Section dot navigation', () => {
    render(<AboutUsPage />);

    // Capture initial state of Item 2 ("seamless & real-time dashboard")
    // Initially inactive in mobile.
    const initialItem2Count = screen.queryAllByText(/seamless & real-time dashboard/i).length;

    // Click dot 3 (index 2)
    // There are buttons with aria-label="Go to step X". 
    // Index 2 is "Go to step 3" (since we used index+1 in aria label code)
    const dot3 = screen.getByLabelText('Go to step 3');
    fireEvent.click(dot3);

    const newItem2Count = screen.queryAllByText(/seamless & real-time dashboard/i).length;

    // Should increase (active in mobile now)
    expect(newItem2Count).toBeGreaterThan(initialItem2Count);
  });
});
