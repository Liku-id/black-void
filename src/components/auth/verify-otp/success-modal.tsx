import React from 'react';
import { Modal, Button, Typography } from '@/components';

interface SuccessModalProps {
  open: boolean;
  onLogin: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onLogin }) => (
  <Modal
    open={open}
    onClose={onLogin}
    title="Registration successful"
    children={
      <>
        <Typography size={14} className="mb-6 block" color="text-white">
          Congratulation, your account has been successfully created.
        </Typography>
      </>
    }
    footer={
      <Button id="register_button" onClick={onLogin}>
        Login
      </Button>
    }
  />
);

export default SuccessModal;
