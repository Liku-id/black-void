export interface AdditionalForm {
  id: string;
  ticketTypeId: string;
  field: string;
  type: 'TEXT' | 'NUMBER' | 'DROPDOWN' | 'CHECKBOX' | 'PARAGRAPH' | 'DATE';
  options: string[];
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Visitor {
  [key: string]: any; // Dynamic fields based on additional_forms
}

export interface FormDataVisitor {
  visitors: Visitor[];
}

export interface FormDataContact {
  fullName: string;
  phoneNumber: string;
  email: string;
  countryCode: string;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  count: number;
  max_order_quantity?: number;
  description?: string;
  sales_start_date?: string;
  sales_end_date?: string;
  ticket_start_date?: string;
  quantity: number;
  purchased_amount: number;
}

export interface TicketSummary {
  id: string;
  name: string;
  price: string;
  count: number;
}

export interface ContactDetails {
  full_name?: string;
  phone_number?: string;
  email?: string;
}
