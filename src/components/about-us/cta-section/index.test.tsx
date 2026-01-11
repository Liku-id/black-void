import React from 'react';
import { render, screen } from '@testing-library/react';
import CTASection from './index';

describe('CTASection', () => {
  it('renders correctly', () => {
    render(<CTASection />);

    expect(screen.getByText(/START YOUR EVENT HERE!/i)).toBeInTheDocument();
    expect(screen.getByText(/An idea is just the beginning/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to craft your experience\?/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Create My Event/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Talk to Our Team/i })).toBeInTheDocument();
  });
});
