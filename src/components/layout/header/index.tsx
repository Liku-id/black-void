'use client';
import Image from 'next/image';
import { Box, TextField, Button, Typography, Container } from '@/components';
import logo from '@/assets/logo/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    console.log('search:', searchValue);
  };

  return (
    <header className="fixed top-6 right-0 left-0 z-50 flex justify-center">
      <Container className="mx-4 flex h-20 items-center border border-black bg-white px-6 py-6 shadow-[4px_4px_0px_0px_#FFF] xl:mx-0">
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

          <Button className="ml-6" onClick={() => router.push('/login')}>
            Log In
          </Button>
        </Box>
      </Container>
    </header>
  );
}
