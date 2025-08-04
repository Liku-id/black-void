import { Box, Typography } from '@/components';
import { formatRupiah } from '@/utils/formatter';

interface PriceDetailProps {
  totalPrice: number;
  paymentMethodFee: number;
  adminFee: number;
  tax: number;
  className?: string;
}

const PriceDetail: React.FC<PriceDetailProps> = ({
  totalPrice,
  paymentMethodFee,
  adminFee,
  tax,
  className = '',
}) => (
  <Box className={className}>
    <Typography type="heading" size={16} className="g:mt-3 lg:mb-1">
      Price Detail
    </Typography>
    <Box className="flex justify-between lg:mb-1">
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-light">
        Ticket Price
      </Typography>
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-bold">
        {formatRupiah(totalPrice)}
      </Typography>
    </Box>
    <Box className="flex justify-between lg:mb-1">
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-light">
        Payment Method Fee
      </Typography>
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-bold">
        {formatRupiah(paymentMethodFee)}
      </Typography>
    </Box>
    <Box className="flex justify-between lg:mb-1">
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-light">
        Admin Fee
      </Typography>
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-bold">
        {formatRupiah(adminFee)}
      </Typography>
    </Box>
    <Box className="flex justify-between">
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-light">
        PB1
      </Typography>
      <Typography
        type="body"
        size={12}
        color="text-muted"
        className="font-bold">
        {formatRupiah(tax)}
      </Typography>
    </Box>
  </Box>
);

export default PriceDetail;
