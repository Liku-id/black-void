import { Button, Modal, Typography } from '@/components';
import React from 'react';

interface UnverifiedModalProps {
  open: boolean;
  onVerify: () => void;
}

const UnverifiedModal: React.FC<UnverifiedModalProps> = ({
  open,
  onVerify,
}) => (
  <Modal
    open={open}
    onClose={() => {}} // Prevent closing
    title="YOUR ACCOUNT IS NOT VERIFIED"
    children={
      <>
        <Typography size={16} className="mb-6 block" color="text-white">
          Please verify your account to continue
        </Typography>
      </>
    }
    footer={
      <Button
        id="verify_account_button"
        onClick={onVerify}
        className="bg-green">
        Verify Account
      </Button>
    }
  />
);

export default UnverifiedModal;
