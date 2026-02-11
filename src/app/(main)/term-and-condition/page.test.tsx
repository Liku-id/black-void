import { render, screen } from '@testing-library/react';
import TermAndConditionPage from './page';

// Mock component
jest.mock('@/components/legal/term-and-condition', () => () => <div data-testid="term-and-condition">TermAndCondition</div>);

describe('TermAndConditionPage', () => {
  it('renders correctly', () => {
    render(<TermAndConditionPage />);
    expect(screen.getByTestId('term-and-condition')).toBeInTheDocument();
  });
});
