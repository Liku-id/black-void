import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography, Button } from '@/components';
import creatorMain from '@/assets/images/creator-main.webp';

const HeroSection = () => {
  return (
    <section className="relative w-full px-4 md:px-0">
      <Box className="relative h-[200px] w-full md:h-[552px] md:w-full md:max-w-[1232px] mx-auto lg:h-[552px]">
        <Image
          src={creatorMain}
          alt="People creating together"
          fill
          className="object-cover"
          priority
        />
        <Box className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 px-4 pointer-events-none pt-0 md:pt-0">
          <Container className="pointer-events-auto">
            <Box className="text-center">
              <Typography
                type="heading"
                as="h1"
                size={46}
                className="mb-6 uppercase leading-tight text-white md:text-[46px] text-[23px]"
              >
                Creating together, one event at a time
              </Typography>
              <Typography
                type="body"
                size={18}
                className="mb-0 md:mb-8 max-w-3xl mx-auto leading-relaxed text-white md:text-[18px] text-[12px]"
              >
                At Wukong, we believe every gathering is a spark of possibility — a chance to awaken new connections, voices, and experiences. Here’s how you, as an event creator, can bring your vision alive with us:
              </Typography>
              <Link href="https://wukong.co.id" className="hidden md:flex justify-center mt-8 md:mt-0">
                <Button
                  type="button"
                  className="mx-auto flex relative z-20 cursor-pointer"
                >
                  Create My Event
                </Button>
              </Link>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Mobile Button (Outside Box) */}
      <Box className="flex md:hidden w-full mx-auto mt-6 justify-center">
        <Link href="https://wukong.co.id">
          <Button
            type="button"
            className="px-6 text-[14px] h-[40px]"
          >
            Create My Event
          </Button>
        </Link>
      </Box>
    </section>
  );
};

export default HeroSection;
