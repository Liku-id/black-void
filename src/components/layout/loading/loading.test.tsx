import { render } from '@testing-library/react';
import Loading from './index';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('Loading Component', () => {
  it('renders the overlay and loading image', () => {
    const { getByAltText, container } = render(<Loading />);
    const loadingImg = getByAltText('Loading...');

    expect(loadingImg).toBeInTheDocument();
    expect(loadingImg).toHaveAttribute('src');
    expect(container.firstChild).toHaveClass('fixed', 'inset-0', 'bg-black/50');
  });

  it('accepts and applies custom className', () => {
    const { container } = render(<Loading className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
