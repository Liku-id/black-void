import React from 'react';
import { render, screen } from '@testing-library/react';
import WhoWeAreSection from './index';

describe('WhoWeAreSection', () => {
  it('renders correctly', () => {
    render(<WhoWeAreSection />);

    expect(screen.getByRole('heading', { name: /Who we are\?/i })).toBeInTheDocument();

    // Check content in dangerouslySetInnerHTML
    // "At Wukong..." might be split by strong tags.
    // simpler check:
    expect(screen.getByText(/true change begins when people come together/i)).toBeInTheDocument();
    expect(screen.getByText(/awakened to emptiness/i)).toBeInTheDocument();
  });
});
