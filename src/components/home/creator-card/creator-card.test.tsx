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
    expect(img.parentElement).toHaveClass(
      'mx-2 flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full bg-white'
    );
  });
});
