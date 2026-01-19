import { PartnershipInfo } from '../types';

export interface TicketType {
  id: string;
  name: string;
  quantity: string;
  description: string;
  price: string;
  event_id: string;
  max_order_quantity: number;
  color_hex: string;
  sales_start_date: string;
  sales_end_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  partnership_info?: PartnershipInfo | null;
  is_public?: boolean;
}

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
  purchased_amount: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

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
  termAndConditions: string;
  websiteUrl: string;
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
  eventOrganizer: any;
  paymentMethods: PaymentMethod[];
  eventAssets: { asset: { url: string } }[];
}
