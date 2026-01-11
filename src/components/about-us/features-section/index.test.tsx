import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturesSection from './index';

describe('FeaturesSection', () => {
  it('renders all features correctly', () => {
    render(<FeaturesSection />);

    // Header
    expect(screen.getByText(/All in one feature for your event marketing/i)).toBeInTheDocument();

    // Feature items
    expect(screen.getByText(/Special leads Requirement/i)).toBeInTheDocument();
    expect(screen.getByText(/Group Ticket/i)).toBeInTheDocument();
    expect(screen.getByText(/Private Link Ticket/i)).toBeInTheDocument();

    // Check descriptions
    expect(screen.getByText(/Capture valuable attendee data/i)).toBeInTheDocument();
    expect(screen.getByText(/Boost sales by offering group deals/i)).toBeInTheDocument();
    expect(screen.getByText(/Drive exclusivity and conversions/i)).toBeInTheDocument();
  });
});
