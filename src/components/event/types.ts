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

export interface PartnershipInfo {
  discount?: number;
  quota?: number;
  sold_count?: number;
  pending_count?: number;
  available_quota?: number;
  max_order_quantity?: number;
  partner_name?: string;
  partner_code?: string;
  expired_at?: string;
}

export interface TicketType {
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  event_id: string;
  max_order_quantity: number;
  color_hex: string;
  sales_start_date: string;
  sales_end_date: string;
  ticketStartDate?: string;
  ticket_start_date?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  partnership_info?: PartnershipInfo | null;
  is_public?: boolean;
  purchased_amount?: number;
  additional_forms?: AdditionalForm[];
}

// Previously in event.ts
export interface GroupTicket {
  id: string;
  ticket_type_id: string;
  bundle_quantity: number;
  description: string;
  name: string;
  price: number;
  quantity: number;
  max_order_quantity: number;
  sales_start_date: string;
  sales_end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  ticket_type?: TicketType;
  purchased_amount: number; // Required by visitor-detail
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
  partnership_info?: PartnershipInfo | null;
  group_ticket_id?: string;
  ticket_type_id?: string;
}

export interface TicketSummary {
  id: string;
  name: string;
  price: string;
  count: number;
  partnership_info?: PartnershipInfo | null;
}

export interface ContactDetails {
  full_name?: string;
  phone_number?: string;
  email?: string;
}

// Previously in event.ts
export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  paymentMethodFee?: number;
}

// Previously in event.ts
export interface EventOrganizer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  asset?: {
    url: string;
  };
}

// Previously in event.ts
export interface EventData {
  id: string;
  name: string;
  eventType: string;
  description: string;
  address: string;
  mapLocationUrl: string;
  metaUrl: string;
  startDate: string;
  endDate: string;
  eventStatus: string;
  login_required?: boolean;
  success?: boolean;
  termAndConditions: string;
  websiteUrl: string;
  adminFee?: number;
  tax?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: string[];
  ticketTypes: TicketType[];
  group_tickets: GroupTicket[];
  lowestTicketPrice?: string | null;

  available_tickets?: any[];
  city: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  eventOrganizer: EventOrganizer;
  paymentMethods: PaymentMethod[];
  eventAssets: { asset: { url: string } }[];
}
