import { render, screen } from '@testing-library/react';
import StripeText from './index';

jest.mock('@/components', () => ({
  __esModule: true,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

describe('StripeText component', () => {
  it('renders with default vertical layout', () => {
    render(<StripeText />);

    const texts = ["Let's collaborate", "Let's create", "Let's connect"];
    texts.forEach(text => {
      expect(screen.getAllByText(text)).toHaveLength(2);
    });

    // Ambil semua elemen dan cek className pada salah satu
    const verticalText = screen.getAllByText("Let's collaborate")[0];
    expect(verticalText.className).toMatch(/rotate-180/);
    expect(verticalText.className).toMatch(/writing-mode/);
  });

  it('renders with horizontal layout and decorative dots', () => {
    const customTexts = ['Hello', 'World'];
    render(
      <StripeText
        direction="horizontal"
        scrollDirection="left-to-right"
        texts={customTexts}
      />
    );

    customTexts.forEach(text => {
      expect(screen.getAllByText(text)).toHaveLength(2);
    });

    // Cari elemen dengan class rounded-full (dot), tidak perlu role presentation
    const dots = Array.from(document.querySelectorAll('.rounded-full'));
    expect(dots.length).toBeGreaterThan(0);
  });

  it('applies correct scroll animation classes', () => {
    const { container } = render(
      <StripeText direction="horizontal" scrollDirection="right-to-left" />
    );

    const animatingElement = container.querySelector(
      '.animate-scroll-horizontal-left'
    );
    expect(animatingElement).toBeInTheDocument();
  });

  it('accepts and applies custom className', () => {
    const { container } = render(<StripeText className="custom-stripe" />);
    expect(container.firstChild).toHaveClass('custom-stripe');
  });
});
