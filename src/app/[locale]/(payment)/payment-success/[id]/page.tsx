import dynamic from 'next/dynamic';

const TransactionStatus = dynamic(
  () => import('@/components/payment/transaction-status')
);

export default function TransactionStatusPage() {
  return <TransactionStatus />;
}
