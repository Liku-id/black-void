import dynamic from 'next/dynamic';

const Ticket = dynamic(() => import('@/components/tickets'));

export default function TicketPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return <Ticket transactionId={id} />;
}
