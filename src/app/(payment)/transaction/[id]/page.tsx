import TransactionConfirmation from '@/components/payment/transaction-confirmation';

export default function TransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return <TransactionConfirmation transactionId={id} />;
}
