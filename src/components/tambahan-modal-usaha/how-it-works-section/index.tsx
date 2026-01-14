'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@/components';
import howItWork1 from '@/assets/images/tambahan-modal-usaha-how-1.webp';
import howItWork2 from '@/assets/images/tambahan-modal-usaha-how-2.webp';
import howItWork3 from '@/assets/images/tambahan-modal-usaha-how-3.webp';
import howItWork4 from '@/assets/images/tambahan-modal-usaha-how-4.webp';

const steps = [
  {
    number: 1,
    title: 'Register WU organizer',
    description: 'Submit your information and wait for verification by the Ekuid team',
    image: howItWork1,
  },
  {
    number: 2,
    title: 'due diligence',
    description: 'The event and issuer undergo a structured due diligence process to assess feasibility, risk, and regulatory compliance',
    image: howItWork2,
  },
  {
    number: 3,
    title: 'open campaign crowdfunding',
    description: 'After approval, your crowdfunding campaign goes live and is open for investors to participate',
    image: howItWork3,
  },
  {
    number: 4,
    title: 'disbursement when campaign fully funded',
    description: 'Once the funding target is reached, funds are released securely to support your event execution',
    image: howItWork4,
  },
];

const HowItWorksSection = () => {
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
      setActiveStep((prev) => (prev + 1 >= steps.length ? 0 : prev + 1));
    } else if (isRightSwipe) {
      // Swipe right - previous step
      setActiveStep((prev) => (prev - 1 < 0 ? steps.length - 1 : prev - 1));
    }
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-0 lg:py-24">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center mb-[60px]">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="text-[32px] text-white font-normal uppercase"
          >
            How It Works
          </Typography>
        </Box>

        <Box className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-28">
          {/* Left Column: Steps */}
          <Box className="flex flex-col gap-4">
            {/* Mobile: Slider - Show only active step */}
            <Box className="lg:hidden">
              <Box
                key={steps[activeStep].number}
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
                    'bg-top', // Changed from bg-black to ensure visibility if background matters, but original was bg-black. keeping consistent.
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
                <Box className="relative cursor-pointer border border-white bg-black p-6 transition-all duration-300 touch-pan-x">
                  <Box className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
                    <Box className="flex h-12 w-12 shrink-0 items-center justify-center bg-white text-black">
                      <Typography
                        type="heading"
                        as="span"
                        size={24}
                      >
                        {steps[activeStep].number}
                      </Typography>
                    </Box>
                    <Box className="flex-1">
                      <Typography
                        type="heading"
                        as="h2"
                        size={24}
                        className="mb-2 lg:mb-2 uppercase text-white"
                      >
                        {steps[activeStep].title}
                      </Typography>
                      <Typography
                        type="body"
                        size={14}
                        className="text-white"
                      >
                        {steps[activeStep].description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Slider Indicator Dots */}
              <Box className="flex justify-center gap-2 mt-6">
                {steps.map((_, index) => (
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

            {/* Desktop: Show all steps */}
            <Box className="hidden lg:flex flex-col gap-10">
              {steps.map((step, index) => (
                <Box key={step.number} className="group relative z-10">
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
                      `${activeStep === index ? 'top-1 left-1 opacity-100' : 'top-0 left-0 opacity-0'}`,
                    ].join(' ')}
                  >
                    {null}
                  </Box>
                  <Box
                    onClick={() => setActiveStep(index)}
                    className="relative cursor-pointer border border-white bg-black p-4 transition-all duration-300"
                  >
                    <Box className="flex items-start gap-10">
                      <Box className="flex h-12 w-12 shrink-0 items-center justify-center bg-white text-black">
                        <Typography
                          type="heading"
                          as="span"
                          size={24}
                        >
                          {step.number}
                        </Typography>
                      </Box>
                      <Box className="flex-1">
                        <Typography
                          type="heading"
                          as="h3"
                          size={24}
                          className="mb-2 uppercase text-white text-[24px]"
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          type="body"
                          size={14}
                          className="text-white"
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Column: Dynamic Image */}
          <Box className="flex items-center justify-center h-full">
            <Box className="relative w-full h-[426px] md:h-[690px] lg:h-full min-h-[426px]">
              <Image
                src={steps[activeStep].image}
                alt={`Step ${steps[activeStep].number}`}
                fill
                className="object-contain" // User didn't ask to change object-fit, just height parity.
                priority
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
