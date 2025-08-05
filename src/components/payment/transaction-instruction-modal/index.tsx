import { Box, Typography } from '@/components';
import { Modal } from '@/components/common/modal';

interface PaymentInstructionModalProps {
  open: boolean;
  onClose: () => void;
  instruction?: {
    name: string;
    steps: string[];
  };
}

export default function PaymentInstructionModal({
  open,
  onClose,
  instruction,
}: PaymentInstructionModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={instruction?.name}
      className="!w-[378px]">
      <Box className="px-4 pb-4">
        <ol className="list-decimal">
          {instruction?.steps?.map((step, idx) => (
            <li key={idx} className="mb-1 text-xs text-white">
              {step}
            </li>
          ))}
        </ol>
      </Box>
    </Modal>
  );
}
