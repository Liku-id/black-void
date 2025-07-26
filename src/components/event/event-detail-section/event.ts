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
  tickets: any[]; // bisa di-type detail jika perlu
  city: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  eventOrganizer: any; // bisa di-type detail jika perlu
  paymentMethods: PaymentMethod[];
  eventAssets: { asset: { url: string } }[];
}
