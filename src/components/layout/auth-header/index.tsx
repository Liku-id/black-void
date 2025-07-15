"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/common/button";

// Path ke logo dan icon
import WhiteLogo from "@/assets/logo/white-logo.svg";
import CloseIcon from "@/assets/icons/close.svg";

interface AuthHeaderProps {
  onClose?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ onClose }) => {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose();
    router.push("/?openMenu=1");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between px-4 py-4 z-50 md:hidden bg-transparent"
      style={{ background: "none" }}
    >
      <Image src={WhiteLogo} alt="Logo" height={24} />
      <Button onClick={handleClose} aria-label="Close" className="bg-black p-0">
        <Image src={CloseIcon} alt="Close" height={24} />
      </Button>
    </header>
  );
};

export default AuthHeader; 