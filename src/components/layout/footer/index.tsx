import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Box, Typography } from '@/components';
import logo from '@/assets/logo/white-logo.svg';

const Footer = () => {
  return (
    <footer className="bg-black pb-[24px] w-full">
      <Container className="pt-14 lg:pt-[96px] px-4">
        <Box className="max-w-[1440px] mx-auto bg-dark-gray py-14 px-4 lg:p-[56px] grid grid-cols-1 lg:[grid-template-columns:2fr_0.75fr_1fr_1.5fr] gap-8 lg:gap-[108px]">
          {/* Part 1: Logo and Text */}
          <Box>
            <Box className="mb-4">
              <Image src={logo} alt="Logo" width={120} height={40} />
            </Box>
            <Typography
              type="body"
              className="text-white font-onest text-[18px] font-semibold leading-normal mb-10"
            >
              PT Aku Rela Kamu Bahagia
            </Typography>
            <Typography
              type="body"
              className="text-white font-onest text-[14px] leading-normal"
            >
              Jl. Ciniru III No.2, RT.2/RW.3, Rw. Barat,Kec. Kby. Baru, Jakarta Selatan 12180,Indonesia
            </Typography>
          </Box>
          {/* Part 2: Event Type */}
          <Box>
            <Typography
              type="heading"
              className="text-white text-[24px] leading-normal mb-4"
            >
              EVENT TYPE
            </Typography>
            <Box className="flex flex-col gap-2">
              <Link href="#project-list" className="text-white font-onest text-[14px]">Music</Link>
              <Link href="#project-list" className="text-white font-onest text-[14px]">Sports</Link>
              <Link href="#project-list" className="text-white font-onest text-[14px]">Exhibition</Link>
              <Link href="#project-list" className="text-white font-onest text-[14px]">Festival</Link>
            </Box>
          </Box>
          {/* Part 3 */}
          <Box>
            <Typography
              type="heading"
              className="text-white text-[24px] leading-normal mb-4"
            >
              ABOUT WUKONG
            </Typography>
            <Box className="flex flex-col gap-2">
              <Link href="/about-us" className="text-white font-onest text-[14px]">About Us</Link>
              <Link href="/terms-and-conditions" className="text-white font-onest text-[14px]">Terms & Conditions</Link>
              <Link href="/privacy-policy" className="text-white font-onest text-[14px]">Privacy Policy</Link>
              <Link href="/cookie-policy" className="text-white font-onest text-[14px]">Cookie Policy</Link>
            </Box>
          </Box>
          {/* Part 4 */}
          <Box>
            <Typography
              type="heading"
              color="text-white"
              className="text-[24px] leading-normal mb-4"
            >
              FOLLOW US ON
            </Typography>

            <Box className="flex flex-col gap-2 mb-10">
              {null}
            </Box>

            <Box>
              <Box className="flex items-center gap-4 mb-2">
                <Box className="w-[24px] h-[24px] bg-white">{null}</Box>
                <Typography type="body" color="text-white" className="text-[14px]">
                  +62 813-8811-9390
                </Typography>
              </Box>
              <Box className="flex items-center gap-4">
                <Box className="w-[24px] h-[24px] bg-white">{null}</Box>
                <Typography type="body" color="text-white" className="text-[14px]">
                  support@wukong.co.id
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      
      <Typography
        type="body"
        className="text-white text-center text-[16px] font-normal mt-6 px-0"
      >
        Version 1.0.0 | Hak Cipta 2025 - {" "}
        <br className="block lg:hidden" />
        PT Aku Rela Kamu Bahagia
      </Typography>
      
    </footer>
  );
};

export default Footer;
