import dynamic from 'next/dynamic';

const TransactionStatus = dynamic(
  () => import('@/components/payment/transaction-status')
);

export default function TransactionStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return <TransactionStatus transactionId={id} />;
}
