import { Box, Typography } from '@/components';
import { formatRupiah } from '@/utils/formatter';
import { useLocale } from 'next-intl';

interface PriceDetailProps {
  totalPrice: number;
  paymentMethodFee: number;
  adminFee: number;
  tax: number;
  className?: string;
  hasPaymentLink?: boolean;
}

const PriceDetail: React.FC<PriceDetailProps> = ({
  totalPrice,
  paymentMethodFee,
  adminFee,
  tax,
  className = '',
  hasPaymentLink = false,
}) => {
  const locale = useLocale();
  console.log(locale, '<<<locale');

  return (
    <Box className={className}>
      <Typography type="heading" size={16} className="g:mt-3 lg:mb-1">
        Price Detail
      </Typography>
      <Box className="flex justify-between lg:mb-1">
        <Typography
          type="body"
          size={12}
          color="text-muted"
          className="font-light"
        >
          Ticket Price
        </Typography>
        <Typography
          type="body"
          size={12}
          color="text-muted"
          className="font-bold"
        >
          {formatRupiah(totalPrice)}
        </Typography>
      </Box>
      {!hasPaymentLink && (
        <Box className="flex justify-between lg:mb-1">
          <Typography
            type="body"
            size={12}
            color="text-muted"
            className="font-light"
          >
            Payment Method Fee
          </Typography>
          <Typography
            type="body"
            size={12}
            color="text-muted"
            className="font-bold"
          >
            {formatRupiah(paymentMethodFee)}
          </Typography>
        </Box>
      )}
      <Box className="flex justify-between lg:mb-1">
        <Typography
          type="body"
          size={12}
          color="text-muted"
          className="font-light"
        >
          Admin Fee
        </Typography>
        <Typography
          type="body"
          size={12}
          color="text-muted"
          className="font-bold"
        >
          {formatRupiah(adminFee)}
        </Typography>
      </Box>
      <Box className="flex justify-between">
        <Typography
          type="body"
          size={12}
          color="text-muted"
          className="font-light"
        >
          Tax
        </Typography>
        <Typography
          type="body"
          size={12}
          color="text-muted"
          className="font-bold"
        >
          {formatRupiah(tax)}
        </Typography>
      </Box>
      {hasPaymentLink && (
        <Typography
          type="body"
          size={10}
          color="text-muted"
          className="mt-3 block font-light italic text-gray-500"
        >
          {locale === 'id'
            ? '* Biaya metode pembayaran dapat dikenakan pada halaman pembayaran berdasarkan metode pembayaran yang Anda pilih.'
            : '* Payment method fees may be applied on the payment checkout page based on your selected channel.'}
        </Typography>
      )}
    </Box>
  );
};

export default PriceDetail;
