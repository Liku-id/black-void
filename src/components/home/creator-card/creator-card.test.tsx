import { render, screen } from '@testing-library/react';
import CreatorCard from './';
import '@testing-library/jest-dom';

describe('CreatorCard', () => {
  it('renders with logo and name', () => {
    render(<CreatorCard logo="logo-url.png" name="Creator Name" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'logo-url.png');
    expect(img).toHaveAttribute('alt', 'Creator Name');
    expect(img).toHaveClass('w-32 h-32 rounded-full object-contain bg-white');
    // Wrapper class
    expect(img.parentElement).toHaveClass('flex-shrink-0 w-40 h-40 bg-white rounded-full flex items-center justify-center cursor-pointer');
  });
}); 