import React from 'react';
import { Modal, Button, Typography } from '@/components';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, onLogin }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Registration successful"
    children={
      <>
        <Typography size={14} className="mb-6 block" color="text-white">
          Congratulation, your account has been successfully created.
        </Typography>
      </>
    }
    footer={<Button onClick={onLogin}>Login</Button>}
  />
);

export default SuccessModal;
