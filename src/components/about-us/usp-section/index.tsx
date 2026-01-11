import React, { useState } from 'react';
import { Box, Container, Typography } from '@/components';

const usps = [
  {
    number: 1,
    title: 'fast & easy buyer check-in',
    description: 'Enable quick, smooth attendee entry with a simple and efficient check-in process',
  },
  {
    number: 2,
    title: 'comprehensive financial report',
    description: 'Access detailed and accurate financial reports to track sales, revenue, and settlements',
  },
  {
    number: 3,
    title: 'seamless & real-time dashboard',
    description: 'Monitor ticket sales, performance, and key metrics in one real-time dashboard',
  },
  {
    number: 4,
    title: 'quick onboarding flow',
    description: 'Get started fast with an intuitive setup designed for effortless event creation',
  },
];

const USPSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - next step
      setActiveStep((prev) => (prev + 1 >= usps.length ? 0 : prev + 1));
    } else if (isRightSwipe) {
      // Swipe right - previous step
      setActiveStep((prev) => (prev - 1 < 0 ? usps.length - 1 : prev - 1));
    }
  };

  return (
    <section className="pt-8 pb-16 lg:pt-16 lg:pb-32 px-4 lg:px-0">
      <Container>
        <Box className="mb-16 lg:mb-32 flex flex-col items-center text-center">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="mb-4 text-white font-bold text-[23px] lg:text-[32px]"
          >
            Manage tickets effortlessly
          </Typography>
          <Typography
            type="body"
            size={14}
            className="text-white max-w-2xl"
          >
            with a user-friendly system. We’re ready to support every stage of your event
          </Typography>
        </Box>

        {/* Mobile: Slider */}
        <Box className="md:hidden">
          <Box
            key={usps[activeStep].number}
            className="group relative z-10"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Offset Layer */}
            <Box
              className={[
                'absolute',
                'z-0',
                'w-full',
                'h-full',
                'border',
                'border-white',
                'bg-black',
                'transition-all',
                'duration-300',
                'top-1',
                'left-1',
                'opacity-100',
              ].join(' ')}
            >
              {null}
            </Box>

            <Box className="relative border border-white bg-black p-6 transition-all duration-300">
              <Box className="flex flex-col gap-6 items-start">
                <Box className="flex h-12 w-12 shrink-0 items-center justify-center bg-white text-black">
                  <Typography
                    type="heading"
                    as="span"
                    size={24}
                    className="font-bold"
                  >
                    {usps[activeStep].number}
                  </Typography>
                </Box>
                <Box className="flex-1">
                  <Typography
                    type="heading"
                    as="h3"
                    size={24}
                    className="mb-2 font-bold uppercase text-white"
                  >
                    {usps[activeStep].title}
                  </Typography>
                  <Typography
                    type="body"
                    size={14}
                    className="text-white"
                  >
                    {usps[activeStep].description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Slider Indicator Dots */}
          <Box className="flex justify-center gap-2 mt-6">
            {usps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`h-1 transition-all ${activeStep === index
                  ? 'w-11 bg-white'
                  : 'w-2 bg-white/40'
                  }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </Box>
        </Box>

        {/* Desktop: Grid */}
        <Box className="hidden md:grid grid-cols-1 gap-8 max-w-[510px] mx-auto">
          {usps.map((item) => (
            <Box key={item.number} className="group relative z-10">
              {/* Offset Layer */}
              <Box
                className={[
                  'absolute',
                  'z-0',
                  'w-full',
                  'h-full',
                  'border',
                  'border-white',
                  'bg-black',
                  'transition-all',
                  'duration-300',
                  'top-0',
                  'left-0',
                  'opacity-0',
                  'group-hover:top-1',
                  'group-hover:left-1',
                  'group-hover:opacity-100',
                ].join(' ')}
              >
                {null}
              </Box>

              <Box className="relative border border-white bg-black p-6 transition-all duration-300">
                <Box className="flex items-start gap-10">
                  <Box className="flex h-12 w-12 shrink-0 items-center justify-center bg-white text-black">
                    <Typography
                      type="heading"
                      as="span"
                      size={24}
                      className="font-bold"
                    >
                      {item.number}
                    </Typography>
                  </Box>
                  <Box className="flex-1">
                    <Typography
                      type="heading"
                      as="h3"
                      size={24}
                      className="mb-2 font-bold uppercase text-white"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      type="body"
                      size={14}
                      className="text-white"
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </section>
  );
};

export default USPSection;
