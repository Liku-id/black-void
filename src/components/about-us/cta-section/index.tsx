import React from 'react';
import { Box, Container, Typography, Button } from '@/components';

const CTASection = () => {
  return (
    <section className="pb-16 lg:pb-32 bg-black text-white px-4 xl:px-0">
      <Container>
        <Box className="flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-16">
          {/* Left Content (Text) */}
          <Box className="text-center xl:text-left max-w-2xl">
            <Typography
              type="heading"
              as="h2"
              size={32}
              className="mb-4 font-bold uppercase text-[23px] xl:text-[32px]"
            >
              START YOUR EVENT HERE!
            </Typography>
            <Typography
              type="body"
              size={18}
              className="mb-4 opacity-80 text-[14px] xl:text-[18px]"
            >
              An idea is just the beginning. Let Wukong be your partner in transforming it into an experience that matters.
            </Typography>
            <Typography
              type="body"
              size={18}
              className="opacity-80 text-[14px] xl:text-[18px]"
            >
              Ready to craft your experience?
            </Typography>
          </Box>

          {/* Right Content (Buttons) */}
          <Box className="flex flex-col md:flex-row gap-4 items-center md:items-start w-auto">
            <Button
              type="button"
              className="w-auto text-[14px] xl:text-[16px]"
            >
              Create My Event
            </Button>
            <Button
              type="button"
              className="w-auto text-[14px] xl:text-[16px]"
            >
              Talk to Our Team
            </Button>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default CTASection;
