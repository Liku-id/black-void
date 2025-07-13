'use client';
import { useEffect, useState } from 'react';
import { Container, Box, Carousel, Slider } from '@/components';
import { useResponsive } from '@/lib/use-responsive';
import Image from 'next/image';

const images = [
  'https://dummyimage.com/900x505/FF6B6B/FFFFFF.png&text=Event+1',
  'https://dummyimage.com/900x505/4ECDC4/FFFFFF.png&text=Event+2',
  'https://dummyimage.com/900x505/45B7D1/FFFFFF.png&text=Event+3',
];

export default function CarouselSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Panggil semua hook di top-level!
  const viewport = useResponsive();
  const isMobile = !viewport.sm;

  const getSliderConfig = () => {
    if (viewport.xl) return { width: 900, height: 500 };
    if (viewport.lg) return { width: 800, height: 450 };
    if (viewport.md) return { width: 550, height: 350 };
    if (viewport.sm) return { width: 450, height: 300 };
    return { width: 350, height: 200 };
  };

  const sliderConfig = getSliderConfig();

  const widthClass =
    sliderConfig.width === 900
      ? 'w-[900px]'
      : sliderConfig.width === 800
        ? 'w-[800px]'
        : sliderConfig.width === 550
          ? 'w-[550px]'
          : sliderConfig.width === 450
            ? 'w-[450px]'
            : 'w-[350px]';

  const heightClass =
    sliderConfig.height === 500
      ? 'h-[500px]'
      : sliderConfig.height === 450
        ? 'h-[450px]'
        : sliderConfig.height === 350
          ? 'h-[350px]'
          : sliderConfig.height === 300
            ? 'h-[300px]'
            : 'h-[200px]';

  if (!mounted) {
    // Skeleton responsif, tanpa border radius, tidak menyebabkan layout shift
    return (
      <section>
        <Container>
          <Box className="flex justify-center">
            <Box className="bg-gray-200 animate-pulse w-[350px] h-[200px] sm:w-[450px] sm:h-[300px] md:w-[550px] md:h-[350px] lg:w-[800px] lg:h-[450px] xl:w-[900px] xl:h-[500px]" />
          </Box>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        <Box className="flex justify-center">
          {isMobile ? (
            <Slider
              autoScroll={false}
              className={`${widthClass} ${heightClass}`}
              itemWidth={sliderConfig.width}
              pagination>
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Image ${i + 1}`}
                  width={sliderConfig.width}
                  height={sliderConfig.height}
                  className="object-cover"
                  draggable={false}
                />
              ))}
            </Slider>
          ) : (
            <Carousel
              images={images}
              className={`${widthClass} ${heightClass}`}
            />
          )}
        </Box>
      </Container>
    </section>
  );
}
