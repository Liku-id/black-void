'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Container, Box, Typography, Button } from '@/components';
import StripeText from '@/components/layout/stripe-text';
import creatorMain from '@/assets/images/creator-main.webp';
import creator1 from '@/assets/images/creator-1.webp';
import creator2 from '@/assets/images/creator-2.webp';
import creator3 from '@/assets/images/creator-3.webp';
import creator4 from '@/assets/images/creator-4.webp';
import brushIcon from '@/assets/icons/brush.svg';
import windowIcon from '@/assets/icons/window.svg';
import handshakeIcon from '@/assets/icons/handshake.svg';
import sunflowerIcon from '@/assets/icons/sunflower.svg';

const steps = [
  {
    number: 1,
    title: 'IMAGINE & DEFINE YOUR GATHERING',
    description:
      'Detail your dream - the name, date, place, and essence of your event. Choose ticket types that reflect your intention.',
    image: creator1,
  },
  {
    number: 2,
    title: 'GUIDE, CELEBRATE, REFLECT',
    description:
      'Track sales in real time. Manage your guest list. On show day, check in with confidence. Afterward, reflect - what worked, what could shine brighter next time.',
    image: creator2,
  },
  {
    number: 3,
    title: 'PUBLISH & OPEN DOORS',
    description:
      "With just a few clicks, your event joins our platform's gallery of stories and possibilities. We provide the tools - you provide the magic.",
    image: creator3,
  },
  {
    number: 4,
    title: 'CONNECT & INVITE',
    description:
      "From friends to strangers, let your audience discover what you've created.",
    image: creator4,
  },
];

const features = [
  {
    icon: brushIcon,
    title: 'SEAMLESS EMPOWERMENT',
    description:
      'We handle payments, ticketing, e-delivery, so you focus on creation.',
  },
  {
    icon: windowIcon,
    title: 'CLARITY & SUPPORT',
    description:
      'A single dashboard, transparent fees, and a team that stands with you.',
  },
  {
    icon: handshakeIcon,
    title: 'FROM LOCAL ROOTS TO GLOBAL REACH',
    description:
      'Whether your gathering is next door or everywhere, we give it space to breathe, grow, connect.',
  },
  {
    icon: sunflowerIcon,
    title: 'PURPOSE WITH PRESENCE',
    description:
      'We see your event as part of something bigger: building community, sharing stories, awakening change.',
  },
];

const text = [
  "Let's collaborate",
  "Let's create",
  'Let’s connect',
  'Let’s Play',
  'Let’s fun',
  'Let’s learn',
];

export default function BecomeCreatorPage() {
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

  const handleCreateEventClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = `${process.env.NEXT_PUBLIC_CREATOR_BASE_URL || ''}?utm_source=wukong&utm_medium=website&utm_campaign=become-creator`;
    if (
      url &&
      url !==
      '?utm_source=wukong&utm_medium=website&utm_campaign=become-creator'
    ) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTalkToTeamClick = () => {
    window.location.href = 'mailto:support@wukong.co.id';
  };

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full">
        <Box className="relative h-[146px] md:h-[552px] w-full max-w-[1232px] mx-auto md:h-[1232px] lg:h-[552px]">
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
                  CREATING TOGETHER, ONE EVENT AT A TIME
                </Typography>
                <Typography
                  type="body"
                  size={18}
                  className="mb-8 max-w-3xl mx-auto leading-relaxed text-white md:text-[18px] text-[12px]"
                >
                  At Wukong, we believe every gathering is a spark of
                  possibility - a chance to awaken new connections, voices, and
                  experiences. Here's how you, as an event creator, can bring
                  your vision alive with us:
                </Typography>
                <Button
                  type="button"
                  onClick={handleCreateEventClick}
                  className="mx-auto flex relative z-20 cursor-pointer"
                >
                  Create My Event
                </Button>
              </Box>
            </Container>
          </Box>
        </Box>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 px-4 md:px-0 lg:py-24 pt-24">
        <Container>
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
                  <Box className="relative cursor-pointer border border-white bg-black p-4 transition-all duration-300 touch-pan-x">
                    <Box className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-4">
                      <Box className="flex h-12 w-12 shrink-0 items-center justify-center bg-white text-black">
                        <Typography
                          type="heading"
                          as="span"
                          size={24}
                          className=""
                        >
                          {steps[activeStep].number}
                        </Typography>
                      </Box>
                      <Box className="flex-1">
                        <Typography
                          type="heading"
                          as="h2"
                          size={32}
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
                            className=""
                          >
                            {step.number}
                          </Typography>
                        </Box>
                        <Box className="flex-1">
                          <Typography
                            type="heading"
                            as="h3"
                            size={32}
                            className="mb-2 uppercase text-white"
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
                  className="object-contain"
                  priority
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-12 px-3 md:px-0 md:py-16 lg:pb-24 lg:pt-0">
        <Container>
          <Box className="text-center mb-12">
            <Typography
              type="heading"
              as="h3"
              size={26}
              className="mb-8 uppercase text-white md:text-[26px]"
            >
              CREATING TOGETHER, ONE EVENT AT A TIME
            </Typography>
          </Box>
          <Box className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4  px-12">
            {features.map((feature, index) => (
              <Box
                key={index}
                className="flex flex-col items-center text-center"
              >
                <Image
                  src={feature.icon}
                  alt="status icon"
                  className="mb-4 text-6xl"
                  width={80}
                  height={80}
                />
                <Typography
                  type="heading"
                  as="h4"
                  size={18}
                  className="mb-4 uppercase text-white"
                >
                  {feature.title}
                </Typography>
                <Typography type="body" size={14} className="text-white">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </section>

      {/* Stripe Text */}
      <section>
        <StripeText
          direction="horizontal"
          scrollDirection="left-to-right"
          texts={text}
          className="h-[64px] text-black"
        />
      </section>

      {/* Call to Action Section */}
      <section className="bg-black py-16 px-4 md:px-0 md:py-20 lg:py-24">
        <Container>
          <Box>
            <Box className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-8 max-w-5xl mx-auto">
              <Box>
                <Typography
                  type="heading"
                  as="h3"
                  size={26}
                  className="mb-6 text-left font-bold uppercase text-white md:text-[26px]"
                >
                  STEP FORWARD - BRING YOUR EVENT TO LIFE
                </Typography>
                <Box className="max-w-[426px]">
                  <Typography
                    type="body"
                    size={14}
                    className="mb-6 text-left flex-1 leading-relaxed text-white"
                  >
                    An idea is just the beginning. Let Wukong be your partner in
                    transforming it into an experience that matters.
                  </Typography>
                </Box>
                <Typography
                  type="body"
                  size={12}
                  className="flex-1 text-left leading-relaxed text-white"
                >
                  Ready to craft your experience?
                </Typography>
              </Box>

              <Box className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button
                  type="button"
                  onClick={handleCreateEventClick}
                  className="flex max-w-[180px] text-[16px] sm:mx-auto"
                >
                  Create My Event
                </Button>
                <Button
                  type="button"
                  onClick={handleTalkToTeamClick}
                  className="flex max-w-[180px] text-[16px] sm:mx-auto"
                >
                  Talk to Our Team
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Stripe Text */}
      <section>
        <StripeText
          direction="horizontal"
          scrollDirection="left-to-right"
          texts={text}
          className="h-[64px] text-black"
        />
      </section>
    </main>
  );
}
