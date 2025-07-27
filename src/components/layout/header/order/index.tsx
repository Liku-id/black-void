'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo/logo.svg';
import { Box } from '@/components/common/box';

export default function Header() {
  return (
    <header className="fixed top-6 right-0 left-0 z-50 flex justify-center px-4">
      <Box className="flex h-20 w-full max-w-7xl border border-black bg-white px-6 py-6 shadow-[4px_4px_0px_0px_#FFF]">
        <Link href="/" aria-label="Home">
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={40}
            className="h-8 w-auto cursor-pointer"
            priority
          />
        </Link>
      </Box>
    </header>
  );
}
