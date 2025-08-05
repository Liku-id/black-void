import dynamic from 'next/dynamic';

const Ticket = dynamic(() => import('@/components/tickets'));

export default function TicketPage () {

  return <Ticket />;
}
