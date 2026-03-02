import { render, screen } from '@testing-library/react';
import ChooseVerificationPage from './page';

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="choose-verification-form">ChooseVerificationForm</div>;
  DynamicComponent.displayName = 'LoadableComponent';
  return DynamicComponent;
});

describe('RegisterChooseVerificationPage', () => {
  it('renders correctly', () => {
    render(<ChooseVerificationPage />);

    // Check for main heading
    // Check for main heading using getAllByText to handle potential duplicates or split text issues
    const headings = screen.getAllByText((content, node) => {
      const hasText = (node: Element) => node.textContent === "let's get wu verified";
      const nodeHasText = hasText(node);
      return nodeHasText || node.textContent?.toLowerCase() === "let's get wu verified";
    });
    expect(headings[0]).toBeInTheDocument();

    // Check for subtext
    expect(screen.getByText(/Choose Wu method to verify Wu account/i)).toBeInTheDocument();

    // Check if form is rendered (mocked)
    expect(screen.getByTestId('choose-verification-form')).toBeInTheDocument();
  });
});
