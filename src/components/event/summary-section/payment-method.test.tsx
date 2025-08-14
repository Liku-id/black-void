import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentMethodAccordion from './payment-method';

// Mock dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, type, size, color }: any) => (
    <span className={`${type}-${size} ${color}`}>{children}</span>
  ),
  Radio: ({ children, checked, onChange, id, name }: any) => (
    <label className={`radio-${checked ? 'checked' : 'unchecked'}`}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        id={id}
        name={name}
      />
      {children}
    </label>
  ),
}));

describe('PaymentMethodAccordion Component', () => {
  const mockMethods = [
    {
      id: 'bca_va',
      name: 'BCA Virtual Account',
      paymentCode: 'BCA_VA',
      paymentMethodFee: 0.5,
      logo: '/bca-logo.png',
    },
    {
      id: 'mandiri_va',
      name: 'Mandiri Virtual Account',
      paymentCode: 'MANDIRI_VA',
      paymentMethodFee: 0.5,
      logo: '/mandiri-logo.png',
    },
    {
      id: 'qris_1',
      name: 'QRIS',
      paymentCode: 'QRIS',
      paymentMethodFee: 1000,
      logo: '/qris-logo.png',
    },
    {
      id: 'qris_2',
      name: 'QRIS ShopeePay',
      paymentCode: 'QRIS_SHOPEE',
      paymentMethodFee: 1000,
      logo: '/shopee-logo.png',
    },
  ];

  const defaultProps = {
    id: 'test_accordion',
    title: 'Test Payment Methods',
    methods: mockMethods,
    filterKey: 'VIRTUAL ACCOUNT',
    selectedPayment: null,
    setSelectedPayment: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render accordion with correct title', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      expect(screen.getByText('Test Payment Methods')).toBeInTheDocument();
    });

    it('should render accordion arrow with correct styling', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const arrow = screen.getByAltText('Toggle');
      expect(arrow).toBeInTheDocument();
      expect(arrow).not.toHaveClass('rotate-180');
    });

    it('should be initially closed', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      // Should not show payment methods initially
      expect(screen.queryByText('BCA Virtual Account')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Mandiri Virtual Account')
      ).not.toBeInTheDocument();
    });

    it('should have proper accordion styling', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      expect(accordionHeader).toHaveClass(
        'flex',
        'cursor-pointer',
        'items-center',
        'justify-between'
      );
    });
  });

  describe('Accordion Toggle Functionality', () => {
    it('should open accordion when clicked', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      expect(screen.getByText('BCA Virtual Account')).toBeInTheDocument();
      expect(screen.getByText('Mandiri Virtual Account')).toBeInTheDocument();
    });

    it('should close accordion when clicked again', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');

      // Open accordion
      fireEvent.click(accordionHeader!);
      expect(screen.getByText('BCA Virtual Account')).toBeInTheDocument();

      // Close accordion
      fireEvent.click(accordionHeader!);
      expect(screen.queryByText('BCA Virtual Account')).not.toBeInTheDocument();
    });

    it('should rotate arrow when toggled', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      const arrow = screen.getByAltText('Toggle');

      // Initially not rotated
      expect(arrow).not.toHaveClass('rotate-180');

      // Click to open
      fireEvent.click(accordionHeader!);
      expect(arrow).toHaveClass('rotate-180');

      // Click to close
      fireEvent.click(accordionHeader!);
      expect(arrow).not.toHaveClass('rotate-180');
    });
  });

  describe('Payment Method Filtering', () => {
    it('should filter Virtual Account methods correctly', () => {
      render(
        <PaymentMethodAccordion {...defaultProps} filterKey="VIRTUAL ACCOUNT" />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      expect(screen.getByText('BCA Virtual Account')).toBeInTheDocument();
      expect(screen.getByText('Mandiri Virtual Account')).toBeInTheDocument();
      expect(screen.queryByText('QRIS')).not.toBeInTheDocument();
      expect(screen.queryByText('QRIS ShopeePay')).not.toBeInTheDocument();
    });

    it('should filter QRIS methods correctly', () => {
      render(<PaymentMethodAccordion {...defaultProps} filterKey="QRIS" />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      expect(screen.queryByText('BCA Virtual Account')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Mandiri Virtual Account')
      ).not.toBeInTheDocument();
      expect(screen.getByText('QRIS')).toBeInTheDocument();
      expect(screen.getByText('QRIS ShopeePay')).toBeInTheDocument();
    });

    it('should handle case-insensitive filtering', () => {
      const methodsWithMixedCase = [
        {
          id: 'bca_va',
          name: 'BCA virtual account',
          paymentCode: 'BCA_VA',
          paymentMethodFee: 0.5,
          logo: '/bca-logo.png',
        },
        {
          id: 'mandiri_va',
          name: 'MANDIRI Virtual Account',
          paymentCode: 'MANDIRI_VA',
          paymentMethodFee: 0.5,
          logo: '/mandiri-logo.png',
        },
      ];

      render(
        <PaymentMethodAccordion
          {...defaultProps}
          methods={methodsWithMixedCase}
          filterKey="VIRTUAL ACCOUNT"
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      expect(screen.getByText('BCA virtual account')).toBeInTheDocument();
      expect(screen.getByText('MANDIRI Virtual Account')).toBeInTheDocument();
    });

    it('should return null when no methods match filter', () => {
      render(
        <PaymentMethodAccordion {...defaultProps} filterKey="NON_EXISTENT" />
      );

      expect(
        screen.queryByText('Test Payment Methods')
      ).not.toBeInTheDocument();
    });
  });

  describe('Payment Method Selection', () => {
    it('should call setSelectedPayment when a method is selected', () => {
      const setSelectedPayment = jest.fn();
      render(
        <PaymentMethodAccordion
          {...defaultProps}
          setSelectedPayment={setSelectedPayment}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const bcaRadio = screen.getByText('BCA Virtual Account').closest('label');
      fireEvent.click(bcaRadio!);

      expect(setSelectedPayment).toHaveBeenCalledWith(mockMethods[0]);
    });

    it('should show selected payment method as checked', () => {
      const selectedPayment = mockMethods[0];
      render(
        <PaymentMethodAccordion
          {...defaultProps}
          selectedPayment={selectedPayment}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const bcaRadio = screen.getByText('BCA Virtual Account').closest('label');
      expect(bcaRadio).toHaveClass('radio-checked');
    });

    it('should show unselected payment methods as unchecked', () => {
      const selectedPayment = mockMethods[0];
      render(
        <PaymentMethodAccordion
          {...defaultProps}
          selectedPayment={selectedPayment}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const mandiriRadio = screen
        .getByText('Mandiri Virtual Account')
        .closest('label');
      expect(mandiriRadio).toHaveClass('radio-unchecked');
    });

    it('should handle multiple selections correctly', () => {
      const setSelectedPayment = jest.fn();
      render(
        <PaymentMethodAccordion
          {...defaultProps}
          setSelectedPayment={setSelectedPayment}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      // Select first method
      const bcaRadio = screen.getByText('BCA Virtual Account').closest('label');
      fireEvent.click(bcaRadio!);
      expect(setSelectedPayment).toHaveBeenCalledWith(mockMethods[0]);

      // Select second method
      const mandiriRadio = screen
        .getByText('Mandiri Virtual Account')
        .closest('label');
      fireEvent.click(mandiriRadio!);
      expect(setSelectedPayment).toHaveBeenCalledWith(mockMethods[1]);
    });
  });

  describe('Payment Method Display', () => {
    it('should display payment method logos', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const bcaLogo = screen.getByAltText('BCA Virtual Account');
      const mandiriLogo = screen.getByAltText('Mandiri Virtual Account');

      expect(bcaLogo).toBeInTheDocument();
      expect(mandiriLogo).toBeInTheDocument();
      expect(bcaLogo).toHaveAttribute('src', '/bca-logo.png');
      expect(mandiriLogo).toHaveAttribute('src', '/mandiri-logo.png');
    });

    it('should display payment method names correctly', () => {
      render(
        <PaymentMethodAccordion {...defaultProps} filterKey="VIRTUAL ACCOUNT" />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      // For Virtual Account, should remove "Virtual Account" from display name
      expect(screen.getByText('BCA')).toBeInTheDocument();
      expect(screen.getByText('Mandiri')).toBeInTheDocument();
    });

    it('should display full name for non-Virtual Account methods', () => {
      render(<PaymentMethodAccordion {...defaultProps} filterKey="QRIS" />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      expect(screen.getByText('QRIS')).toBeInTheDocument();
      expect(screen.getByText('QRIS ShopeePay')).toBeInTheDocument();
    });

    it('should have proper grid layout for payment methods', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const methodsContainer = screen
        .getByText('BCA Virtual Account')
        .closest('div')?.parentElement;
      expect(methodsContainer).toHaveClass('grid', 'grid-cols-2', 'gap-4');
    });
  });

  describe('Radio Button Functionality', () => {
    it('should have correct radio button IDs', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const bcaRadio = screen
        .getByText('BCA Virtual Account')
        .closest('label')
        ?.querySelector('input');
      const mandiriRadio = screen
        .getByText('Mandiri Virtual Account')
        .closest('label')
        ?.querySelector('input');

      expect(bcaRadio).toHaveAttribute('id', 'bca_va_payment');
      expect(mandiriRadio).toHaveAttribute('id', 'mandiri_va_payment');
    });

    it('should have correct radio button names', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'payment-method');
      });
    });

    it('should handle radio button change events', () => {
      const setSelectedPayment = jest.fn();
      render(
        <PaymentMethodAccordion
          {...defaultProps}
          setSelectedPayment={setSelectedPayment}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const bcaRadio = screen
        .getByText('BCA Virtual Account')
        .closest('label')
        ?.querySelector('input');
      fireEvent.change(bcaRadio!);

      expect(setSelectedPayment).toHaveBeenCalledWith(mockMethods[0]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty methods array', () => {
      render(<PaymentMethodAccordion {...defaultProps} methods={[]} />);

      expect(
        screen.queryByText('Test Payment Methods')
      ).not.toBeInTheDocument();
    });

    it('should handle methods without names', () => {
      const methodsWithoutNames = [
        {
          id: 'test_1',
          name: undefined,
          paymentCode: 'TEST_1',
          paymentMethodFee: 0.5,
          logo: '/test-logo.png',
        },
      ];

      render(
        <PaymentMethodAccordion
          {...defaultProps}
          methods={methodsWithoutNames}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      // Should not crash, but may not display the method
      expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    });

    it('should handle methods without payment codes', () => {
      const methodsWithoutCodes = [
        {
          id: 'test_1',
          name: 'Test Method',
          paymentCode: undefined,
          paymentMethodFee: 0.5,
          logo: '/test-logo.png',
        },
      ];

      render(
        <PaymentMethodAccordion
          {...defaultProps}
          methods={methodsWithoutCodes}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      // Should not crash, but may not generate proper ID
      expect(screen.getByText('Test Method')).toBeInTheDocument();
    });

    it('should handle missing setSelectedPayment function', () => {
      render(
        <PaymentMethodAccordion
          {...defaultProps}
          setSelectedPayment={undefined}
        />
      );

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      // Should not crash when clicking on radio buttons
      const bcaRadio = screen.getByText('BCA Virtual Account').closest('label');
      expect(() => fireEvent.click(bcaRadio!)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      expect(accordionHeader).toHaveAttribute('id', 'test_accordion');
    });

    it('should handle keyboard navigation for accordion toggle', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');

      // Test Enter key
      fireEvent.keyDown(accordionHeader!, { key: 'Enter' });
      expect(screen.getByText('BCA Virtual Account')).toBeInTheDocument();

      // Test Space key
      fireEvent.keyDown(accordionHeader!, { key: ' ' });
      expect(screen.queryByText('BCA Virtual Account')).not.toBeInTheDocument();
    });

    it('should handle keyboard navigation for radio buttons', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      fireEvent.click(accordionHeader!);

      const bcaRadio = screen
        .getByText('BCA Virtual Account')
        .closest('label')
        ?.querySelector('input');

      // Test Enter key
      fireEvent.keyDown(bcaRadio!, { key: 'Enter' });
      expect(defaultProps.setSelectedPayment).toHaveBeenCalledWith(
        mockMethods[0]
      );

      // Test Space key
      fireEvent.keyDown(bcaRadio!, { key: ' ' });
      expect(defaultProps.setSelectedPayment).toHaveBeenCalledTimes(2);
    });
  });

  describe('Styling and Layout', () => {
    it('should have proper accordion container styling', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const accordionHeader = screen
        .getByText('Test Payment Methods')
        .closest('div');
      expect(accordionHeader).toHaveClass('py-3', 'lg:py-4');
    });

    it('should have proper arrow container styling', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const arrowContainer = screen.getByAltText('Toggle').closest('div');
      expect(arrowContainer).toHaveClass(
        'bg-light-gray',
        'border-gray',
        'border',
        'h-6',
        'w-6'
      );
    });

    it('should have proper content transition styling', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const contentContainer = screen.getByText('Test Payment Methods')
        .parentElement?.nextElementSibling;
      expect(contentContainer).toHaveClass(
        'overflow-hidden',
        'transition-all',
        'duration-300',
        'ease-in-out'
      );
    });

    it('should have proper divider styling', () => {
      render(<PaymentMethodAccordion {...defaultProps} />);

      const divider = screen.getByText('Test Payment Methods').parentElement
        ?.nextElementSibling?.nextElementSibling;
      expect(divider).toHaveClass('border-muted', 'border-t-[0.5px]');
    });
  });
});
