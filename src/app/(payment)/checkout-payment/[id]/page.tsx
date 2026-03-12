import dynamic from 'next/dynamic';

const TransactionConfirmation = dynamic(
  () => import('@/components/payment/transaction-confirmation')
);

export default function TransactionPage() {
  return <TransactionConfirmation />;
}
