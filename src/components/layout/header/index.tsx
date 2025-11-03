'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/lib/api/axios-client';
import { getErrorMessage } from '@/lib/api/error-handler';
import { useAuth } from '@/lib/session/use-auth';
import { Box, Button, Typography, Container } from '@/components';
import logo from '@/assets/logo/logo.svg';
import logout from '@/assets/icons/logout.svg';
import whiteLogo from '@/assets/logo/white-logo.svg';
// import searchIcon from '@/assets/icons/search.svg';
import burgerIcon from '@/assets/icons/burger.svg';
import closeIcon from '@/assets/icons/close.svg';
import ticket from '@/assets/icons/ticket.svg';
import ProfileMenu from './profile-menu';
import LogOutModal from './logout-modal';

export default function Header() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, userData, checkAuth, loading } = useAuth();

  // Initialize state
  const [openMenu, setOpenMenu] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [_, setError] = useState('');

  // Logout
  const onLogout = async () => {
    setError('');
    setLoadingLogout(true);
    try {
      await axios.post('/api/auth/logout');
      setOpenMenu(false);
      setOpenLogoutModal(false);
      await checkAuth(); // reset auth global
      router.replace('/');
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingLogout(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('openMenu') === '1') {
      setOpenMenu(true);
    }
  }, [searchParams]);

  return (
    <header className="fixed top-6 right-0 left-0 z-50 flex justify-center px-4">
      {/* Desktop Header */}
      <Container className="mx-4 hidden h-20 items-center border border-black bg-white px-6 py-6 shadow-[4px_4px_0px_0px_#FFF] lg:flex xl:mx-0">
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
        {/* TODO: PHASE 2 */}
        {/* <TextField
          placeholder="Looking for an exciting event?"
          className="ml-6 w-[424px]"
          value={searchValue}
          onChange={setSearchValue}
          endIcon={searchIcon}
          onEndIconClick={handleSearch}
        /> */}
        <Box className="ml-auto flex items-center">
          <Link
            id="btn_blog"
            href="https://blog.wukong.co.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              type="body"
              size={16}
              color="text-black"
              className="hover:text-green ml-6 cursor-pointer"
            >
              Blog
            </Typography>
          </Link>
          <Link
            id="btn_contact"
            href="mailto:support@wukong.co.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              type="body"
              size={16}
              color="text-black"
              className="hover:text-green ml-6 cursor-pointer"
            >
              Contact Us
            </Typography>
          </Link>
          <Link
            id="btn_become_creator"
            href="/become-creator"
            className="hover:text-green"
          >
            <Typography
              type="body"
              size={16}
              color="text-black"
              className="hover:text-green ml-6 cursor-pointer"
            >
              Become Creator?
            </Typography>
          </Link>
          {loading && (
            <Box className="ml-6 h-9 w-20 animate-pulse bg-gray-200" />
          )}
          {!loading && !isLoggedIn && (
            <Link id="btn_login" href="/login" className="ml-6">
              <Button>Get In</Button>
            </Link>
          )}
          {!loading && isLoggedIn && userData && (
            <ProfileMenu
              userData={userData}
              setOpenModal={setOpenLogoutModal}
            />
          )}
        </Box>
      </Container>
      {/* Mobile Header */}
      <Container className="flex h-16 w-full items-center justify-between border border-black bg-white px-4 py-4 shadow-[4px_4px_0px_0px_#FFF] lg:hidden">
        <Link href="/" aria-label="Home">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <Box className="flex items-center gap-4">
          {/* TODO: PHASE 2 */}
          {/* <Box
            onClick={handleSearch}
            aria-label="Search"
            className="h-auto w-auto cursor-pointer bg-white p-0">
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </Box> */}
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
          <Link href="/" aria-label="Home" onClick={() => setOpenMenu(false)}>
            <Image
              src={whiteLogo}
              alt="Logo"
              width={100}
              height={24}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Box onClick={() => setOpenMenu(false)} className="cursor-pointer">
            <Image src={closeIcon} alt="Close" width={24} height={24} />
          </Box>
        </Box>

        {isLoggedIn === null && (
          <Box className="mt-11 h-8 w-full animate-pulse bg-gray-200 md:ml-6" />
        )}

        {isLoggedIn === true && userData && (
          <ProfileMenu
            className="mt-11"
            userData={userData}
            setOpenModal={setOpenLogoutModal}
            onClose={() => setOpenMenu(false)}
          />
        )}

        <Box className="mt-[44px] flex flex-1 flex-col">
          <Link
            id="btn_blog"
            href="https://blog.wukong.co.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green mb-6"
          >
            <Typography type="body" size={16} color="text-white">
              Blog
            </Typography>
          </Link>
          <Link
            id="btn_contact"
            href="mailto:support@wukong.co.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green mb-6"
          >
            <Typography type="body" size={16} color="text-white">
              Contact Us
            </Typography>
          </Link>
          <Link
            id="btn_become_creator"
            href="/become-creator"
            className="hover:text-green"
          >
            <Typography type="body" size={16} color="text-white">
              Become Creator?
            </Typography>
          </Link>
          <Box className="flex-1" />
          {isLoggedIn ? (
            <Box
              className="group text-danger mb-40 flex cursor-pointer items-center justify-center gap-2 transition-all duration-300 hover:gap-3 hover:text-red-500"
              onClick={() => {
                setOpenLogoutModal(true);
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
          ) : (
            <Link href="/login" className="mb-40 flex justify-center">
              <Button id="btn_login" className="px-[18px] py-[8px]">
                Get In
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      {/* Logout Modal */}
      <LogOutModal
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        onLogout={onLogout}
        loading={loadingLogout}
      />
    </header>
  );
}
