'use client';
import { useEffect, useState } from 'react';
import { Container, Box, Carousel, Slider } from '@/components';
import Image from 'next/image';

const images = [
  'https://dummyimage.com/900x505/FF6B6B/FFFFFF.png&text=Event+1',
  'https://dummyimage.com/900x505/4ECDC4/FFFFFF.png&text=Event+2',
  'https://dummyimage.com/900x505/45B7D1/FFFFFF.png&text=Event+3',
];

export default function CarouselSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Skeleton: box dengan shimmer effect
    return (
      <section>
        <Container>
          <Box className="flex justify-center">
            <Box className="h-[200px] w-full max-w-[450px] animate-pulse bg-gray-200 sm:h-[300px] md:h-[350px] md:max-w-[550px] lg:h-[450px] lg:max-w-[800px] xl:h-[500px] xl:max-w-[900px]" />
          </Box>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        <Box className="flex justify-center">
          {/* Mobile: tampilkan Slider */}
          <div className="block md:hidden">
            <Slider
              autoScroll={false}
              className="h-[200px] w-[350px] max-w-full sm:h-[225px] sm:w-[450px] md:h-[350px] md:w-[550px] lg:h-[450px] lg:w-[800px] xl:h-[500px] xl:w-[900px]"
              itemWidth={350}
              pagination>
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Image ${i + 1}`}
                  width={350}
                  height={200}
                  className="object-cover"
                  draggable={false}
                />
              ))}
            </Slider>
          </div>
          {/* Mulai md ke atas: tampilkan Carousel */}
          <div className="hidden md:block">
            <Carousel
              images={images}
              className="h-[200px] w-[350px] max-w-full sm:h-[300px] sm:w-[450px] md:h-[350px] md:w-[550px] lg:h-[450px] lg:w-[800px] xl:h-[500px] xl:w-[900px]"
            />
          </div>
        </Box>
      </Container>
    </section>
  );
}
