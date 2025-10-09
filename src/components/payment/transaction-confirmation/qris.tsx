'use client';
import html2canvas from 'html2canvas';
import { Box, Container, Typography, Button, QRCode } from '@/components';
import { formatCountdownTime, formatRupiah } from '@/utils/formatter';

interface QRISComponentProps {
  data: any;
  mutate: any;
  secondsLeft: number;
}

const QRISComponent: React.FC<QRISComponentProps> = ({
  data,
  mutate,
  secondsLeft,
}) => {
  const handleDownloadQRCode = async () => {
    const qrElement = document.getElementById('qr-code');
    if (qrElement) {
      const canvas = await html2canvas(qrElement);
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qr-code.png';
      link.click();
    }
  };

  return (
    <Container className="flex justify-center">
      <Box className="mb-20 min-w-full px-4 sm:min-w-[653px] sm:px-0">
        <Typography
          type="heading"
          size={30}
          color="text-white"
          className="mb-2">
          One more step to have fun
        </Typography>
        <Box className="border bg-white p-6 shadow-[4px_4px_0px_0px_#fff]">
          <Typography type="body" size={14} className="mb-1 font-light">
            Transaction Number:{' '}
            <span className="font-bold">
              {data.transaction.transactionNumber}
            </span>
          </Typography>
          <Box className="flex items-center justify-between">
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-light">
              Complete your booking in:
            </Typography>
            <Typography type="body" size={16} className="text-red font-bold">
              {formatCountdownTime(secondsLeft)}
            </Typography>
          </Box>

          <Box id="qr-code" className="flex justify-center py-8">
            <QRCode
              value={data.transaction.paymentDetails.qris.qrString}
              size={200}
            />
          </Box>

          <Box className="flex flex-col items-center">
            <Typography type="heading" size={32} className="mb-2 leading-none">
              {formatRupiah(data.transaction.paymentDetails.qris.amount)}
            </Typography>
            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="font-light">
              Xendit Payment gateway
            </Typography>
          </Box>

          <hr className="border-muted my-6 border-[0.5px]" />

          <Box className="my-6 flex justify-center">
            <Button
              className="h-[32px] border border-black bg-white px-2 text-[12px] font-light text-black"
              onClick={handleDownloadQRCode}>
              Download QR code
            </Button>
          </Box>

          <Box className="flex justify-center">
            <Button id="btn_ep_confirm_payment" onClick={mutate}>
              Confirm Payment
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default QRISComponent;
