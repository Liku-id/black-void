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
    title="Wu-hoo!"
    children={
      <>
        <Typography size={14} className="mb-6 block" color="text-white">
          you are now The Chosen Wu!
        </Typography>
      </>
    }
    footer={
      <Button id="register_button" onClick={onLogin}>
        Get In
      </Button>
    }
  />
);

export default SuccessModal;
