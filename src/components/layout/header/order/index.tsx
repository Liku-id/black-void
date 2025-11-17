'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo/logo.svg';
import { Container } from '@/components';

export default function Header() {
  return (
    <header className="w-full -mt-[96px] lg:-mt-[136px] px-4">
      <Container className="flex h-16 items-center border border-black bg-white px-4 py-4 shadow-[4px_4px_0px_0px_#FFF] md:h-20 lg:px-6 lg:py-6">
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
      </Container>
    </header>
  );
}
