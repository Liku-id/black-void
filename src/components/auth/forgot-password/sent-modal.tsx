import React from 'react';
import { Modal, Button, Typography } from '@/components';
import { useTranslations } from 'next-intl';

interface SentModalProps {
  open: boolean;
  onClose: () => void;
  sentEmail: string;
  onResend: () => void;
  isLoading: boolean;
}

const SentModal: React.FC<SentModalProps> = ({
  open,
  onClose,
  sentEmail,
  onResend,
  isLoading,
}) => {
  const t = useTranslations('forgotPassword');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('success_title')}
      children={
        <>
          <Typography size={14} className="mb-6 block" color="text-white">
            {t.rich('success_message', {
              email: sentEmail,
              bold: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </Typography>
          <Typography size={14} className="mb-4 block" color="text-white">
            {t('no_message')}
          </Typography>
        </>
      }
      footer={
        <Button onClick={onResend} disabled={isLoading}>
          {isLoading ? 'Sending...' : t('resend_link')}
        </Button>
      }
    />
  );
};

export default SentModal;
