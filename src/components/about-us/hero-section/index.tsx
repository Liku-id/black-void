import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography, Button } from '@/components';
import creatorMain from '@/assets/images/creator-main.webp';

const HeroSection = () => {
  const handleStartFundingClick = () => {
    // TODO: Add navigation or action here
    console.log("Start Funding Clicked");
  };

  return (
    <section className="relative w-full">
      <Box className="relative h-[420px] md:h-[552px] w-full max-w-[1232px] mx-auto lg:h-[552px]">
        <Image
          src={creatorMain}
          alt="People creating together"
          fill
          className="object-cover"
          priority
        />
        <Box className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 px-4 pointer-events-none pt-16 md:pt-0">
          <Container className="pointer-events-auto">
            <Box className="text-center">
              <Typography
                type="heading"
                as="h1"
                size={46}
                className="mb-6 font-bold uppercase leading-tight text-white md:text-[46px] text-[23px]"
              >
                All in One Ticketing & Event<br />Management System Platform
              </Typography>
              <Typography
                type="body"
                size={18}
                className="mb-8 max-w-3xl mx-auto leading-relaxed text-white md:text-[18px] text-[12px]"
              >
                A simple, powerful ticketing system designed for creators. We help<br />clients run events smoothly and efficiently
              </Typography>
              <Button
                type="button"
                onClick={handleStartFundingClick}
                className="mx-auto flex relative z-20 cursor-pointer"
              >
                Start Funding
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </section>
  );
};

export default HeroSection;
