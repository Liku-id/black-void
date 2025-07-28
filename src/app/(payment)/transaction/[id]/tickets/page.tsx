import MyTicket from '@/components/my-ticket';
import { Box } from '@/components';

export default function TicketPage() {
  const data = {
    event: {
      name: 'Summer Music Festival 2024',
      address:
        'Jl. Ciniru III No.2, RT.2/RW.3, Rw. Bar., Kec. Kby. Baru, Jakarta Selatan 12180, Indonesia',
      mapURL: '',
    },
    tickets: [
      {
        qrValue: 'test',
        name: 'Misbahul Munir',
        type: 'VIP',
        quantity: 2,
        price: 1500000,
        date: '2024-07-01',
      },
    ],
  };

  if (!data) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <Box className="text-gray-500">No ticket data found</Box>
      </Box>
    );
  }

  return <MyTicket data={data} />;
}
