import { render, screen } from '@testing-library/react';
import AuthSegmentLayout from './layout';

jest.mock('@/components/layout/header', () => () => (
  <div data-testid="header">Header</div>
));
jest.mock('@/components/layout/footer', () => () => (
  <div data-testid="footer">Footer</div>
));

describe('AuthSegmentLayout', () => {
  it('renders Header, Footer, and children inside <main> with correct classes', () => {
    render(
      <AuthSegmentLayout>
        <div data-testid="child">Main Content</div>
      </AuthSegmentLayout>
    );
    const main = screen.getByRole('main');
    expect(main).toHaveClass('px-0 pt-36 xl:pt-40');
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
