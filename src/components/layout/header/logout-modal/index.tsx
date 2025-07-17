import React, { useState } from 'react';
import { Modal, Button, Typography, Box } from '@/components';

interface LogOutModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

const LogOutModal: React.FC<LogOutModalProps> = ({
  open,
  onClose,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await onLogout();
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log out"
      children={
        <Typography size={14} className="mb-6 block" color="text-white">
          Are you sure you want to log out?
        </Typography>
      }
      footer={
        <Box className="flex gap-4">
          <Button
            id="cancel_button"
            onClick={onClose}
            disabled={loading}
            aria-disabled={loading}
          >
            No, Back to Home
          </Button>
          <Button
            id="continue_button"
            variant="outline-white"
            onClick={handleLogout}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? 'Logging out...' : 'Yes, Continue'}
          </Button>
        </Box>
      }
    />
  );
};

export default LogOutModal;
