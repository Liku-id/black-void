import { render, screen, fireEvent } from '@testing-library/react';
import FAQSection from './';
import '@testing-library/jest-dom';

// Mock Accordion agar mudah dicek
jest.mock('@/components/common/accordion', () => (props: any) => (
  <div data-testid="accordion" data-open={props.open} onClick={props.onClick}>
    {props.question}
  </div>
));

describe('FAQSection', () => {
  it('renders FAQ title and all Accordion components', () => {
    render(<FAQSection />);
    // Judul FAQ
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    // Ada 10 Accordion
    const accordions = screen.getAllByTestId('accordion');
    expect(accordions).toHaveLength(10);
    // Pertanyaan pertama benar
    expect(accordions[0]).toHaveTextContent('1. How do I buy a ticket??');
    expect(accordions[9]).toHaveTextContent(
      '10. How do I contact customer support?'
    );
  });

  it('can expand and collapse Accordion', () => {
    render(<FAQSection />);
    const accordions = screen.getAllByTestId('accordion');
    // Awal semua tertutup
    accordions.forEach(acc =>
      expect(acc).toHaveAttribute('data-open', 'false')
    );
    // Klik Accordion pertama
    fireEvent.click(accordions[0]);
    // Accordion pertama terbuka
    expect(accordions[0]).toHaveAttribute('data-open', 'true');
    // Klik lagi untuk collapse
    fireEvent.click(accordions[0]);
    expect(accordions[0]).toHaveAttribute('data-open', 'false');
  });

  it('can expand and collapse Accordion in right column', () => {
    render(<FAQSection />);
    const accordions = screen.getAllByTestId('accordion');
    // Klik Accordion ke-6 (idx 5, kolom kanan)
    fireEvent.click(accordions[5]);
    expect(accordions[5]).toHaveAttribute('data-open', 'true');
    // Collapse lagi
    fireEvent.click(accordions[5]);
    expect(accordions[5]).toHaveAttribute('data-open', 'false');
  });

  it('only one Accordion can be open at a time', () => {
    render(<FAQSection />);
    const accordions = screen.getAllByTestId('accordion');
    // Buka Accordion pertama
    fireEvent.click(accordions[0]);
    expect(accordions[0]).toHaveAttribute('data-open', 'true');
    // Buka Accordion ke-6 (kolom kanan)
    fireEvent.click(accordions[5]);
    expect(accordions[0]).toHaveAttribute('data-open', 'false');
    expect(accordions[5]).toHaveAttribute('data-open', 'true');
  });
});
