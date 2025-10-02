import dynamic from 'next/dynamic';
import { Container, Typography } from '@/components';

const MyTicket = dynamic(() => import('@/components/tickets'));

export default function MyTicketPage() {
  return (
    <main>
      <Container className="px-4">
        {/* Header */}
        <Typography
          type="heading"
          size={30}
          color="text-white"
          className="font-bold uppercase"
        >
          YOUR TICKET
        </Typography>
        {/* Content */}
        <MyTicket />;
      </Container>
    </main>
  );
}
