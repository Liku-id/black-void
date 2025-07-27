'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/common/button';

// Path ke logo dan icon
import WhiteLogo from '@/assets/logo/white-logo.svg';
import CloseIcon from '@/assets/icons/close.svg';

interface AuthHeaderProps {
  onClose?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ onClose }) => {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose();
    router.push('/?openMenu=1');
  };

  return (
    <header
      className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-transparent px-4 py-4 md:hidden"
      style={{ background: 'none' }}>
      <Image src={WhiteLogo} alt="Logo" height={24} />
      <Button onClick={handleClose} aria-label="Close" className="bg-black p-0">
        <Image src={CloseIcon} alt="Close" height={24} />
      </Button>
    </header>
  );
};

export default AuthHeader;
