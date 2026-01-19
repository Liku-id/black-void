import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography, Button } from '@/components';
import sunflowerIcon from '@/assets/icons/sunflower.svg';
import eventType1 from '@/assets/images/tambahan-modal-usaha-event-1.webp';
import eventType2 from '@/assets/images/tambahan-modal-usaha-event-2.webp';
import eventType3 from '@/assets/images/tambahan-modal-usaha-event-3.webp';
import eventType4 from '@/assets/images/tambahan-modal-usaha-event-4.webp';

const eventTypes = [
  { img: eventType1, text: 'Sports & running events' },
  { img: eventType2, text: 'Community & creative events' },
  { img: eventType3, text: 'Conferences & exhibitions' },
  { img: eventType4, text: 'Music & entertainment events' },
];

const EventTypesSection = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

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
      setActiveStep((prev) => (prev + 1 >= eventTypes.length ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setActiveStep((prev) => (prev - 1 < 0 ? eventTypes.length - 1 : prev - 1));
    }
  };

  const handleScrollToForm = () => {
    const element = document.getElementById('funding-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="px-4 xl:px-0 pt-8 pb-16 lg:pt-[60px] lg:pb-[120px]">
      <Container>
        <Box className="grid grid-cols-1 xl:grid-cols-2 gap-[40px] items-stretch">
          <Box className="relative w-full min-h-[408px] md:min-h-[502px] overflow-hidden bg-[var(--color-dark-gray)]">

            <Box className="relative z-10 w-full h-full flex flex-col items-start justify-center text-left px-[28px]">
              <Box className="mb-6 relative w-[80px] h-[80px] shrink-0">
                <Image
                  src={sunflowerIcon}
                  alt="Sunflower Icon"
                  fill
                  className="object-contain"
                />
              </Box>

              <Typography
                type="heading"
                as="h3"
                className="mb-4 text-white uppercase text-[24px] md:text-[32px]"
              >
                Built for Various Event Types
              </Typography>

              <Typography
                type="body"
                size={14}
                className="mb-10 text-white opacity-90 max-w-sm"
              >
                Whether you run small community events or large-scale productions, our funding model adapts to your event goals
              </Typography>

              <Button id="cta2_funding" type="button" onClick={handleScrollToForm}>
                Start Funding
              </Button>
            </Box>
          </Box>

          {/* Wrapper for Slider (Mobile) and Grid (Desktop) */}
          <Box className="w-full relative">
            {/* Mobile: Slider (Active Step) */}
            <Box className="block md:hidden w-full">
              <Box
                className="relative w-full h-[240px] overflow-hidden group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={eventTypes[activeStep].img}
                  alt={eventTypes[activeStep].text}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Box className="absolute inset-0 bg-black/20" />
                <Box className="absolute bottom-[24px] left-0 right-0 text-center px-4">
                  <Typography
                    type="heading"
                    as="h4"
                    className="text-white text-[16px] leading-tight"
                  >
                    {eventTypes[activeStep].text}
                  </Typography>
                </Box>
              </Box>

              {/* Slider Indicator Dots */}
              <Box className="flex justify-center gap-2 mt-6">
                {eventTypes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`h-1 transition-all ${activeStep === index
                      ? 'w-11 bg-white'
                      : 'w-2 bg-white/40'
                      }`}
                    aria-label={`Go to event type ${index + 1}`}
                  />
                ))}
              </Box>
            </Box>

            {/* Desktop: Grid */}
            <Box className="hidden md:grid md:grid-cols-2 gap-x-[24px] gap-y-[24px]">
              {eventTypes.map((item, index) => (
                <Box key={index} className="relative w-full h-[240px] overflow-hidden group">
                  <Image
                    src={item.img}
                    alt={item.text}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Box className="absolute inset-0 bg-black/20" />

                  <Box className="absolute bottom-[24px] left-0 right-0 text-center px-4">
                    <Typography
                      type="heading"
                      as="h4"
                      className="text-white text-[16px] leading-tight"
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default EventTypesSection;
