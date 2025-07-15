import React from 'react';
import { Modal, Button, Typography } from '@/components';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  const handleLogin = () => router.push('/login');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="RESET PASSWORD COMPLETE"
      children={
        <Typography size={14} className="mb-6 block" color="text-white">
          Your password has been succesfully reset.
        </Typography>
      }
      footer={
        <Button onClick={handleLogin}>Login</Button>
      }
    />
  );
};

export default SuccessModal; 