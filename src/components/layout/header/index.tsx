'use client';
import { useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import { Box, TextField, Button, Typography, Container } from '@/components';
import logo from '@/assets/logo/logo.svg';
import whiteLogo from '@/assets/logo/white-logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import { useState } from 'react';
import burgerIcon from '@/assets/icons/burger.svg';
import closeIcon from '@/assets/icons/close.svg';

export default function Header() {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [openMenu, setOpenMenu] = useState(false);

  const handleSearch = () => {
    console.log('search:', searchValue);
  };

  useEffect(() => {
    if (searchParams.get("openMenu") === "1") {
      setOpenMenu(true);
    }
  }, [searchParams]);

  return (
    <header className="fixed top-6 right-0 left-0 z-50 flex justify-center px-4">
      {/* Desktop Header */}
      <Container className="mx-4 hidden h-20 items-center border border-black bg-white px-6 py-6 shadow-[4px_4px_0px_0px_#FFF] lg:flex xl:mx-0">
        <Image
          src={logo}
          alt="Logo"
          width={120}
          height={40}
          className="h-8 w-auto"
          priority
        />
        <TextField
          placeholder="Looking for an exciting event?"
          className="ml-6 w-[424px]"
          value={searchValue}
          onChange={setSearchValue}
          endIcon={searchIcon}
          onEndIconClick={handleSearch}
        />
        <Box className="ml-auto flex items-center">
          <Typography
            type="body"
            size={16}
            color="text-black"
            className="ml-6 cursor-pointer">
            Contact Us
          </Typography>

          <Typography
            type="body"
            size={16}
            color="text-black"
            className="ml-6 cursor-pointer">
            Become Creator ?
          </Typography>

          <Link id="login_button" href="/login" className="ml-6">
            <Button>Log In</Button>
          </Link>
        </Box>
      </Container>
      {/* Mobile Header */}
      <Container className="mx-2 flex h-16 w-full items-center justify-between border border-black bg-white px-4 py-4 shadow-[4px_4px_0px_0px_#FFF] lg:hidden">
        <Image
          src={logo}
          alt="Logo"
          width={100}
          height={32}
          className="h-8 w-auto"
          priority
        />
        <Box className="flex items-center gap-4">
          <Box
            onClick={handleSearch}
            aria-label="Search"
            className="h-auto w-auto cursor-pointer bg-white p-0">
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </Box>
          <Box
            onClick={() => setOpenMenu(true)}
            aria-label="Menu"
            className="cursor-pointer">
            <Image src={burgerIcon} alt="Menu" width={28} height={28} />
          </Box>
        </Box>
      </Container>
      {/* Mobile Fullscreen Menu Popup */}
      <Box
        className={`fixed inset-0 z-[100] bg-black px-4 pt-6 transition-transform duration-300 ${openMenu ? 'pointer-events-auto translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'} h-full min-h-screen flex flex-col`}
        style={{ willChange: 'transform' }}>
        <Box className="flex items-start justify-between">
          <Image
            src={whiteLogo}
            alt="Logo"
            width={100}
            height={24}
            className="h-8 w-auto"
            priority
          />
          <Box onClick={() => setOpenMenu(false)} className="cursor-pointer">
            <Image src={closeIcon} alt="Close" width={24} height={24} />
          </Box>
        </Box>
        <Box className="mt-[44px] flex flex-col flex-1">
          <Link href="#" className="mb-6">
            <Typography type="body" size={16} color="text-white">
              Contact Us
            </Typography>
          </Link>
          <Link href="#">
            <Typography type="body" size={16} color="text-white">
              Become Creator ?
            </Typography>
          </Link>
          <Box className="flex-1" />
          <Link href="/login" className="flex justify-center mb-40">
            <Button className="px-[18px] py-[8px]">Log In</Button>
          </Link>
        </Box>
      </Box>
    </header>
  );
}
