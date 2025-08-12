import { render, screen, fireEvent } from '@testing-library/react';
import PaymentInstructionModal from './index';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/components', () => ({
  Box: ({ children, className }: any) => (
    <div data-testid="box" className={className}>
      {children}
    </div>
  ),
  Typography: ({ children, type, size, color, className }: any) => (
    <div
      data-type={type}
      data-size={size}
      data-color={color}
      className={className}
    >
      {children}
    </div>
  ),
}));

jest.mock('@/components/common/modal', () => ({
  Modal: ({ children, open, onClose, title, className }: any) =>
    open ? (
      <div data-testid="modal" className={className}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe('PaymentInstructionModal', () => {
  const mockInstruction = {
    name: 'Bank Transfer Instructions',
    steps: [
      'Open your banking app',
      'Select transfer',
      'Enter the account number',
      'Enter the amount',
      'Confirm the transfer',
    ],
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal Rendering', () => {
    it('renders modal when open is true', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('does not render modal when open is false', () => {
      render(
        <PaymentInstructionModal
          open={false}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('displays instruction title', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Bank Transfer Instructions'
      );
    });

    it('renders with correct modal class', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal')).toHaveClass('!w-[378px]');
    });
  });

  describe('Instruction Steps', () => {
    it('renders all instruction steps', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByText('Open your banking app')).toBeInTheDocument();
      expect(screen.getByText('Select transfer')).toBeInTheDocument();
      expect(screen.getByText('Enter the account number')).toBeInTheDocument();
      expect(screen.getByText('Enter the amount')).toBeInTheDocument();
      expect(screen.getByText('Confirm the transfer')).toBeInTheDocument();
    });

    it('renders steps in ordered list', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const orderedList = screen.getByRole('list');
      expect(orderedList).toBeInTheDocument();
      expect(orderedList).toHaveClass('list-decimal');
    });

    it('renders correct number of list items', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(5);
    });

    it('applies correct styling to list items', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).toHaveClass('mb-1', 'text-xs', 'text-white');
      });
    });
  });

  describe('Modal Content Structure', () => {
    it('renders modal content wrapper', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('renders content with correct padding', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const contentBox = screen.getByTestId('box');
      expect(contentBox).toHaveClass('px-4', 'pb-4');
    });
  });

  describe('Close Functionality', () => {
    it('renders close button', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal-close')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const closeButton = screen.getByTestId('modal-close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing instruction gracefully', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={undefined}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('');
    });

    it('handles instruction without name', () => {
      const instructionWithoutName = {
        name: '',
        steps: ['Step 1', 'Step 2'],
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={instructionWithoutName}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent('');
    });

    it('handles instruction without steps', () => {
      const instructionWithoutSteps = {
        name: 'Test Instructions',
        steps: [],
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={instructionWithoutSteps}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Test Instructions'
      );
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('handles instruction with null steps', () => {
      const instructionWithNullSteps = {
        name: 'Test Instructions',
        steps: null as any,
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={instructionWithNullSteps}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Test Instructions'
      );
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('handles instruction with undefined steps', () => {
      const instructionWithUndefinedSteps = {
        name: 'Test Instructions',
        steps: undefined as any,
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={instructionWithUndefinedSteps}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Test Instructions'
      );
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('handles single step instruction', () => {
      const singleStepInstruction = {
        name: 'Single Step',
        steps: ['Only one step'],
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={singleStepInstruction}
        />
      );

      expect(screen.getByText('Only one step')).toBeInTheDocument();
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    it('handles long step text', () => {
      const longStepInstruction = {
        name: 'Long Steps',
        steps: [
          'This is a very long step description that might contain a lot of text and should be handled properly by the component without breaking the layout or causing any issues with the rendering',
        ],
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={longStepInstruction}
        />
      );

      expect(
        screen.getByText(longStepInstruction.steps[0])
      ).toBeInTheDocument();
    });

    it('handles steps with special characters', () => {
      const specialCharInstruction = {
        name: 'Special Characters',
        steps: [
          'Step with & symbols',
          'Step with < > tags',
          'Step with "quotes"',
          "Step with 'apostrophes'",
        ],
      };

      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={specialCharInstruction}
        />
      );

      expect(screen.getByText('Step with & symbols')).toBeInTheDocument();
      expect(screen.getByText('Step with < > tags')).toBeInTheDocument();
      expect(screen.getByText('Step with "quotes"')).toBeInTheDocument();
      expect(screen.getByText("Step with 'apostrophes'")).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders ordered list with proper semantics', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const orderedList = screen.getByRole('list');
      expect(orderedList.tagName).toBe('OL');
    });

    it('renders list items with proper semantics', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item.tagName).toBe('LI');
      });
    });

    it('provides close button with proper role', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const closeButton = screen.getByTestId('modal-close');
      expect(closeButton.tagName).toBe('BUTTON');
    });
  });

  describe('Props Validation', () => {
    it('accepts open prop as boolean', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('accepts onClose prop as function', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      const closeButton = screen.getByTestId('modal-close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('accepts instruction prop with name and steps', () => {
      render(
        <PaymentInstructionModal
          open={true}
          onClose={mockOnClose}
          instruction={mockInstruction}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        mockInstruction.name
      );
      expect(screen.getByText(mockInstruction.steps[0])).toBeInTheDocument();
    });
  });
});
