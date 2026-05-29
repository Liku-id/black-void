import { Button, Modal, Typography } from '@/components';
import React from 'react';
import { useTranslations } from 'next-intl';

interface SuccessModalProps {
  open: boolean;
  onContinue: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onContinue }) => {
  const t = useTranslations('register.modal');

  return (
    <Modal
      open={open}
      onClose={onContinue}
      title={t('title')}
      children={
        <>
          <Typography size={14} className="mb-6 block" color="text-white">
            {t('desc')}
          </Typography>
        </>
      }
      footer={
        <Button id="register_button" onClick={onContinue}>
          {t('button')}
        </Button>
      }
    />
  );
};

export default SuccessModal;
