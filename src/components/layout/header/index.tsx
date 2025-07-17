'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAtom } from 'jotai';
import { fetchAuthAtom, userDataAtom } from '@/store';
import { getErrorMessage } from '@/lib/api/error-handler';
import { Box, TextField, Button, Typography, Container } from '@/components';
import logo from '@/assets/logo/logo.svg';
import whiteLogo from '@/assets/logo/white-logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import { useState } from 'react';
import burgerIcon from '@/assets/icons/burger.svg';
import closeIcon from '@/assets/icons/close.svg';
import ProfileMenu from './profile-menu';
import LogOutModal from './logout-modal';

export default function Header() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state
  const [searchValue, setSearchValue] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [_, setError] = useState('');
  const [isLoggedIn, checkAuth] = useAtom(fetchAuthAtom);
  const [userData] = useAtom(userDataAtom);

  const handleSearch = () => {
    console.log('search:', searchValue);
  };

  // Logout
  const onLogout = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/logout', {
        userId: userData.id,
      });
      if (response.status === 200) {
        router.replace('/');
      }
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('openMenu') === '1') {
      setOpenMenu(true);
    }
  }, [searchParams]);

  // Check auth
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
            className="ml-6 cursor-pointer"
          >
            Contact Us
          </Typography>

          <Typography
            type="body"
            size={16}
            color="text-black"
            className="ml-6 cursor-pointer"
          >
            Become Creator ?
          </Typography>

          {isLoggedIn === null && (
            <Box className="ml-6 animate-pulse rounded-md bg-gray-200 h-8 w-18" />
          )}

          {isLoggedIn === false && (
            <Link id="login_button" href="/login" className="ml-6">
              <Button>Log In</Button>
            </Link>
          )}

          {isLoggedIn === true && (
            <ProfileMenu
              userData={userData}
              setOpenModal={setOpenLogoutModal}
            />
          )}
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
            className="h-auto w-auto cursor-pointer bg-white p-0"
          >
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </Box>
          <Box
            onClick={() => setOpenMenu(true)}
            aria-label="Menu"
            className="cursor-pointer"
          >
            <Image src={burgerIcon} alt="Menu" width={28} height={28} />
          </Box>
        </Box>
      </Container>
      {/* Mobile Fullscreen Menu Popup */}
      <Box
        className={`fixed inset-0 z-[100] bg-black px-4 pt-6 transition-transform duration-300 ${openMenu ? 'pointer-events-auto translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'} flex h-full min-h-screen flex-col`}
        style={{ willChange: 'transform' }}
      >
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

        {isLoggedIn === null && (
          <Box className="md:ml-6 animate-pulse rounded-md bg-gray-200 h-8 w-full mt-11" />
        )}

        {isLoggedIn === true && (
          <ProfileMenu
            className="mt-11"
            userData={userData}
            setOpenModal={setOpenLogoutModal}
          />
        )}

        <Box className="mt-[44px] flex flex-1 flex-col">
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

          {isLoggedIn === false && (
            <Link href="/login" className="mb-40 flex justify-center">
              <Button className="px-[18px] py-[8px]">Log In</Button>
            </Link>
          )}
        </Box>
      </Box>

      {/* Logout Modal */}
      <LogOutModal
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        onLogout={onLogout}
        loading={loading}
      />
    </header>
  );
}
