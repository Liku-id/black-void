import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './index';

describe('Accordion (single element, controlled)', () => {
  const question = 'Apa itu Likuid?';
  const answer = 'Likuid adalah platform ...';

  it('renders the question', () => {
    render(
      <Accordion
        question={question}
        answer={answer}
        open={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByText(question)).toBeInTheDocument();
  });

  it('does not render the answer when closed', () => {
    render(
      <Accordion
        question={question}
        answer={answer}
        open={false}
        onClick={() => {}}
      />
    );
    const answerBox = screen.getByText(answer).parentElement;
    expect(answerBox).toHaveClass('opacity-0');
    expect(answerBox).toHaveClass('max-h-0');
  });

  it('renders the answer when open', () => {
    render(
      <Accordion
        question={question}
        answer={answer}
        open={true}
        onClick={() => {}}
      />
    );
    expect(screen.getByText(answer)).toBeVisible();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Accordion
        question={question}
        answer={answer}
        open={false}
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByText(question));
    expect(handleClick).toHaveBeenCalled();
  });

  it('icon rotates when open', () => {
    render(
      <Accordion
        question={question}
        answer={answer}
        open={true}
        onClick={() => {}}
      />
    );
    const icon = screen.getByAltText(/toggle faq/i);
    expect(icon.className).toMatch(/rotate-180/);
  });

  it('icon does not rotate when closed', () => {
    render(
      <Accordion
        question={question}
        answer={answer}
        open={false}
        onClick={() => {}}
      />
    );
    const icon = screen.getByAltText(/toggle faq/i);
    expect(icon.className).not.toMatch(/rotate-180/);
  });
});
