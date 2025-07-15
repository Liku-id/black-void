import React from 'react';
import { Modal, Button, Typography } from '@/components';

interface SentModalProps {
  open: boolean;
  onClose: () => void;
  sentEmail: string;
  onResend: () => void;
}

const SentModal: React.FC<SentModalProps> = ({
  open,
  onClose,
  sentEmail,
  onResend,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Email is Sent!"
    children={
      <>
        <Typography size={14} className="mb-6 block" color="text-white">
          A message is sent to email{' '}
          <span className="font-bold">{sentEmail}</span>. Please check your
          inbox for reset password instruction
        </Typography>
        <Typography size={14} className="mb-4 block" color="text-white">
          Didn’t get the message?
        </Typography>
      </>
    }
    footer={<Button onClick={onResend}>Resend Link</Button>}
  />
);

export default SentModal;
