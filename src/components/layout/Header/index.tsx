'use client';
import Image from 'next/image';
import { Box, TextField } from '@/components';
import logo from '@/assets/logo/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import { useState } from 'react';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log('search:', searchValue);
  };

  return (
    <header className="fixed top-6 right-0 left-0 z-50 flex justify-center">
      <Box className="flex h-20 w-[1140px] items-center border border-black bg-white px-[40px] py-6 shadow-[4px_4px_0px_0px_#FFF]">
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
          className="w-[424px] ml-6"
          value={searchValue}
          onChange={setSearchValue}
          endIcon={searchIcon} 
          onEndIconClick={handleSearch}
        />
      </Box>
    </header>
  );
}
