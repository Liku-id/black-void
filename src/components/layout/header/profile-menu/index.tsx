'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import { Box, Typography } from '@/components';
import dropDown from '@/assets/icons/accordion-arrow.svg';
import profile from '@/assets/icons/profile-default.svg';
import logout from '@/assets/icons/logout.svg';
import ticket from '@/assets/icons/ticket.svg';
import whiteArrow from '@/assets/icons/arrow-white.svg';

interface ProfileMenuProps {
  className?: string;
  userData: {
    id: string;
    fullName: string;
    email: string;
  };
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  className,
  userData,
  setOpenModal,
}) => {
  // Initialize state
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box ref={menuRef} className={cn('relative lg:ml-6', className)}>
      {/* Toggle */}
      <Box
        id="profile_toggle"
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <Box className="flex items-center gap-4">
          <Image src={profile} alt="profile" width={32} height={32} />
          <Typography className="text-white lg:hidden">Profile</Typography>
        </Box>

        <Box className="hidden lg:block">
          <Image src={dropDown} alt="profile-dropdown" width={32} height={32} />
        </Box>

        <Box className="rotate-180 lg:hidden">
          <Image
            src={whiteArrow}
            alt="profile-dropdown"
            width={16}
            height={16}
          />
        </Box>
      </Box>

      {/* Animated Menu */}
      <Box
        className={`absolute right-0 mt-4 hidden w-75 origin-top-right border bg-white px-4 py-5 shadow-[4px_4px_0px_0px_#FFF] transition-all duration-300 lg:mt-9 lg:block ${
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <Box className="mb-4 flex items-center gap-4">
          <Image src={profile} alt="profile" width={32} height={32} />
          <Box>
            <Typography>{userData.fullName}</Typography>
            <Typography size={12} className="text-muted">
              {userData.email}
            </Typography>
          </Box>
        </Box>

        <Link
          id="my_tickets_link"
          href="/ticket"
          className="mb-4 flex cursor-pointer items-center gap-2  transition-all duration-300 hover:gap-3"
          onClick={() => setOpen(false)}
        >
          <Typography className="transition-all duration-300 hover:font-medium">
            My Ticket
          </Typography>
        </Link>

        <hr className="my-4 border-gray-300" />

        <Box
          className="group text-danger flex cursor-pointer items-center gap-2 transition-all duration-300 hover:gap-3 hover:text-red-500"
          onClick={() => {
            setOpenModal(true);
            setOpen(false);
          }}
        >
          <Image src={logout} alt="logout" width={24} height={24} />
          <Typography
            id="logout_button"
            className="transition-all duration-300 group-hover:font-medium group-hover:text-red-500"
          >
            Log Out
          </Typography>
        </Box>

        <hr className="mt-4 border-gray-300" />
      </Box>

      {/* Mobile Accordion Menu */}
      <Box
        className={`transition-all duration-300 ease-in-out lg:hidden ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <Box className="mt-4 px-12">
          <Typography color="text-white" className="mb-1">
            {userData.fullName}
          </Typography>
          <Typography size={12} className="text-white">
            {userData.email}
          </Typography>
        </Box>

        <Link
          href="/ticket"
          className="mt-4 flex cursor-pointer items-center gap-2 px-12 transition-all duration-300 hover:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image src={ticket} alt="ticket" width={24} height={24} />
          <Typography
            color="text-white"
            className="transition-all duration-300 hover:font-medium"
          >
            My Ticket
          </Typography>
        </Link>

        <hr className="mt-4 border-gray-300" />
      </Box>
    </Box>
  );
};

export default ProfileMenu;
