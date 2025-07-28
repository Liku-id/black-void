import PaymentConfirmation from '@/components/payment/payment-confirmation';
import { Box } from '@/components';

export default function TransactionPage() {
  const transaction = {
    event: {
      name: 'Summer Music Festival 2024',
    },
    eventOrganizer: {
      name: 'Wukong Entertainment',
    },
    transactionNumber: 'EVENTA123',
    createdAt: '2024-07-01T12:00:00Z',
    expiredAt: '2024-07-01T12:05:00Z',
    paymentMethod: {
      type: 'va',
      number: '1234567890123456',
      amount: 3600000,
      bankType: 'bca',
    },
    tickets: [
      {
        type: 'VIP',
        quantity: 2,
        price: 1500000,
      },
    ],
    adminFee: 5,
  };

  // Calculate totals
  const calculateTotals = (transaction: any) => {
    const subtotal = transaction.tickets.reduce(
      (sum: number, ticket: any) => sum + ticket.price * ticket.quantity,
      0
    );
    const adminFee = Math.round(subtotal * (transaction.adminFee / 100));
    const pb1 = Math.round(
      subtotal * Number(process.env.NEXT_PUBLIC_PB1 || 0.1)
    );
    const totalPayment = subtotal + adminFee + pb1;

    return { subtotal, adminFee, pb1, totalPayment };
  };

  const totals = calculateTotals(transaction);

  if (!transaction) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <Box className="text-gray-500">No transaction data found</Box>
      </Box>
    );
  }

  return <PaymentConfirmation transaction={transaction} totals={totals} />;
}
