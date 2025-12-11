import { Modal, Button, Typography } from '@/components';
import React from 'react';

interface SafariWarningModalProps {
  open: boolean;
  onClose: () => void;
}

const SafariWarningModal: React.FC<SafariWarningModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Safari Browser Notice"
      children={
        <Typography size={16} className="mb-6 block" color="text-white">
          Safari requires repeated camera permissions. Please use Chrome or
          another browser for a better experience.
        </Typography>
      }
      footer={
        <Button id="safari_warning_ok_button" onClick={onClose}>
          Got it
        </Button>
      }
    />
  );
};

export default SafariWarningModal;


