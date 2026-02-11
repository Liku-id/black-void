import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import VisitorDetailSection from './index';
import { useForm } from 'react-hook-form';

// Mocks
jest.mock('@/components', () => ({
  Typography: ({ children }: any) => <span>{children}</span>,
  Box: ({ children }: any) => <div>{children}</div>,
  Checkbox: ({ children, checked, onChange, disabled }: any) => (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      {children}
    </label>
  ),
}));

jest.mock('./field-renderer', () => () => <div data-testid="field-renderer">FieldRenderer</div>);

function renderWithForms(props: any) {
  const { result: contactResult } = renderHook(() => useForm({
    defaultValues: {
      fullName: 'John Contact',
      phoneNumber: '123',
      email: 'john@example.com',
      countryCode: '+62'
    }
  }));

  const { result: visitorResult } = renderHook(() => useForm({
    defaultValues: {
      visitors: [{}]
    }
  }));

  return render(
    <VisitorDetailSection
      contactMethods={contactResult.current}
      visitorMethods={visitorResult.current}
      {...props}
    />
  );
}

describe('VisitorDetailSection', () => {
  const mockSetChecked = jest.fn();
  const defaultProps = {
    isVisitorDetailChecked: false,
    setIsVisitorDetailChecked: mockSetChecked,
    tickets: [
      { id: 't1', name: 'VIP', count: 1, price: 100, quantity: 10, purchased_amount: 0 }
    ],
    ticketType: {
      additional_forms: [{ id: 'f1', field: 'fullname', order: 1 }]
    },
    groupTicket: null,
  };

  it('renders visitor details correctly', () => {
    renderWithForms(defaultProps);

    expect(screen.getByText('Visitor Details')).toBeInTheDocument();
    expect(screen.getByText('Ticket VIP #1')).toBeInTheDocument();
    expect(screen.getByTestId('field-renderer')).toBeInTheDocument();
  });

  it('handles checkbox change', () => {
    renderWithForms(defaultProps);

    // Checkbox text "Same as contact details"
    const checkbox = screen.getByLabelText('Same as contact details');
    fireEvent.click(checkbox);

    expect(mockSetChecked).toHaveBeenCalledWith(true); // toggled from false
  });
});
