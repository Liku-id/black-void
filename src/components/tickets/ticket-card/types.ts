export interface TicketData {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'ongoing' | 'expired';
  eventId: string;
}
