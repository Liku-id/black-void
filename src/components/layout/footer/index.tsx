import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Box, Typography } from '@/components';
import logo from '@/assets/logo/white-logo.svg';
import emailIcon from '@/assets/icons/email.svg';
import instagramIcon from '@/assets/icons/Instagram.svg';
import smsIcon from '@/assets/icons/sms.svg';

const Footer = () => {
  return (
    <footer className="w-full bg-black pb-[24px]">
      <Container className="pt-14 lg:pt-[96px]">
        <Box className="bg-dark-gray mx-auto grid max-w-[1140px] grid-cols-1 gap-8 px-4 py-14 lg:[grid-template-columns:2fr_0.75fr_1fr_1.5fr] lg:gap-[108px] lg:p-[56px]">
          {/* Part 1: Logo and Text */}
          <Box>
            <Box className="mb-4">
              <Image src={logo} alt="Logo" width={120} height={40} />
            </Box>
            <Typography
              type="body"
              className="font-onest mb-10 text-[18px] leading-normal font-semibold text-white">
              PT Aku Rela Kamu Bahagia
            </Typography>
            <Typography
              type="body"
              className="font-onest text-[14px] leading-normal text-white">
              Jl. Ciniru III No.2, RT.2/RW.3, Rw. Barat,Kec. Kby. Baru, Jakarta
              Selatan 12180,Indonesia
            </Typography>
          </Box>
          {/* Part 2: Event Type */}
          <Box>
            <Typography
              type="heading"
              className="mb-4 text-[24px] leading-normal text-white">
              EVENT TYPE
            </Typography>
            <Box className="flex flex-col gap-2">
              <Link
                href="#project-list"
                className="hover:text-green font-onest text-[14px] text-white">
                Music
              </Link>
              <Link
                href="#project-list"
                className="hover:text-green font-onest text-[14px] text-white">
                Sports
              </Link>
              <Link
                href="#project-list"
                className="hover:text-green font-onest text-[14px] text-white">
                Exhibition
              </Link>
              <Link
                href="#project-list"
                className="hover:text-greenfont-onest text-[14px] text-white">
                Festival
              </Link>
            </Box>
          </Box>
          {/* Part 3 */}
          <Box>
            <Typography
              type="heading"
              className="mb-4 text-[24px] leading-normal text-white">
              ABOUT WUKONG
            </Typography>
            <Box className="flex flex-col gap-2">
              <Link
                href="/about-us"
                className="hover:text-green font-onest text-[14px] text-white">
                About Us
              </Link>
              <Link
                href="/term-and-condition"
                className="hover:text-green font-onest text-[14px] text-white">
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-green font-onest text-[14px] text-white">
                Privacy Policy
              </Link>
              <Link
                href="/cookie-policy"
                className="hover:text-green font-onest text-[14px] text-white">
                Cookie Policy
              </Link>
            </Box>
          </Box>
          {/* Part 4 */}
          <Box>
            <Typography
              type="heading"
              color="text-white"
              className="mb-4 text-[24px] leading-normal">
              FOLLOW US ON
            </Typography>

            <Box className="mb-10 flex flex-col gap-2">
              <Link
                href="https://www.instagram.com/wukong.co.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Image
                  src={instagramIcon}
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="box-content rounded-full bg-white p-2"
                  draggable={false}
                  priority
                />
              </Link>
            </Box>

            <Box>
              <Box className="mb-2 flex items-center gap-4">
                <Image src={smsIcon} alt="sms" width={24} height={24} />
                <Link
                  href="https://wa.me/6285121328284"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Typography
                    type="body"
                    color="text-white"
                    className="cursor-pointer text-[14px] transition">
                    +62 851-2132-8284
                  </Typography>
                </Link>
              </Box>
              <Box className="flex items-center gap-4">
                <Image src={emailIcon} alt="email" width={24} height={24} />
                <Link
                  href="mailto:support@wukong.co.id"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Typography
                    type="body"
                    color="text-white"
                    className="cursor-pointer text-[14px] transition">
                    support@wukong.co.id
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      <Typography
        type="body"
        className="mt-6 px-0 text-center text-[16px] font-normal text-white">
        Version 1.0.0 | Hak Cipta 2025 - <br className="block lg:hidden" />
        PT Aku Rela Kamu Bahagia
      </Typography>
    </footer>
  );
};

export default Footer;
