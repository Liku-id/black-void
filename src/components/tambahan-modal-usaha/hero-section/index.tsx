import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography, Button } from '@/components';
import heroImage from '@/assets/images/tambahan-modal-usaha-hero.webp';

const HeroSection = () => {
  const handleScrollToForm = () => {
    const element = document.getElementById('funding-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full px-4 md:px-0">
      <Box className="relative h-[200px] w-full md:h-[552px] md:w-full md:max-w-[1232px] mx-auto lg:h-[552px]">
        <Image
          src={heroImage}
          alt="People creating together"
          fill
          className="object-cover"
          priority
        />
        <Box className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 pointer-events-none md:pt-0 px-[18px] py-[27px] md:p-0">
          <Container className="pointer-events-auto p-0">
            <Box className="text-center">
              <Typography
                type="heading"
                as="h1"
                className="mb-6 uppercase leading-tight text-white md:text-[46px] text-[23px]"
              >
                Reliable Funding for professional<br />Event Organizers
              </Typography>
              <Typography
                type="body"
                className="mb-0 md:mb-8 max-w-3xl mx-auto leading-relaxed text-white md:text-[18px] text-[12px]"
              >
                Access reliable funding collaborate . Built to support professional<br />workflows and long-term event growth
              </Typography>
              <Box className="hidden md:flex flex-col md:flex-row items-center justify-center gap-4">
                <Link
                  href="https://wa.me/6285121328284"
                  target="_blank"
                  passHref
                  className="w-full md:w-auto"
                >
                  <Button
                    type="button"
                    variant="outline-white"
                    className="w-full text-[14px] md:text-[16px]"
                  >
                    Talk to Our Team
                  </Button>
                </Link>
                <Button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full md:w-auto text-[14px] md:text-[16px]"
                >
                  Start Funding
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Mobile Buttons (Outside Box) */}
      <Box className="flex md:hidden w-full mx-auto gap-4 mt-4">
        <Link
          href="https://wa.me/6285121328284"
          target="_blank"
          passHref
          className="flex-1"
        >
          <Button
            type="button"
            variant="outline-white"
            className="w-full text-[12px] h-[40px] border-white text-white hover:bg-white hover:text-black"
          >
            Talk to Our Team
          </Button>
        </Link>
        <Button
          type="button"
          onClick={handleScrollToForm}
          className="flex-1 text-[12px] h-[40px]"
        >
          Start Funding
        </Button>
      </Box>

    </section >
  );
};

export default HeroSection;
