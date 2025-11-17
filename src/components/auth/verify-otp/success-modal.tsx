import { Button, Modal, Typography } from '@/components';
import React from 'react';

interface SuccessModalProps {
  open: boolean;
  onContinue: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onContinue }) => (
  <Modal
    open={open}
    onClose={onContinue}
    title="Wu-hoo!"
    children={
      <>
        <Typography size={14} className="mb-6 block" color="text-white">
          you are now The Chosen Wu!
        </Typography>
      </>
    }
    footer={
      <Button id="register_button" onClick={onContinue}>
        Get In
      </Button>
    }
  />
);

export default SuccessModal;
