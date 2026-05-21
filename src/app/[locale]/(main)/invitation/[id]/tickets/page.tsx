import dynamic from 'next/dynamic';

const Ticket = dynamic(() => import('@/components/tickets/ticket-detail'));

export default function InvitationTicketPage() {
  return <Ticket type="invitation" />;
}
