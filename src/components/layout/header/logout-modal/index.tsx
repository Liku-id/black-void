import { Modal, Button, Typography, Box } from '@/components';

interface LogOutModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
  loading: boolean;
}

const LogOutModal: React.FC<LogOutModalProps> = ({
  open,
  onClose,
  onLogout,
  loading,
}) => {
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
            className="text-[12px] md:text-[14px]"
            onClick={onClose}
            disabled={loading}
            aria-disabled={loading}>
            No, Back to Home
          </Button>
          <Button
            id="continue_logout_button"
            className="text-[12px] md:text-[14px]"
            variant="outline-white"
            onClick={onLogout}
            disabled={loading}
            aria-disabled={loading}>
            {loading ? 'Logging out...' : 'Yes, Continue'}
          </Button>
        </Box>
      }
    />
  );
};

export default LogOutModal;
