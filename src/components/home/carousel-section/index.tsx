'use client';
import useSWR from 'swr';
import { Container, Box, Carousel, Slider } from '@/components';
import Image from 'next/image';

export default function CarouselSection() {
  const { data, isLoading } = useSWR('/api/events/thumbnails');
  const items = data || [];

  if (isLoading) {
    return (
      <section>
        <Container>
          <Box className="flex justify-center">
            <Box className="h-[200px] w-full max-w-[390px] animate-pulse bg-gray-200 sm:h-[300px] md:h-[350px] md:max-w-[550px] lg:h-[450px] lg:max-w-[800px] xl:h-[500px] xl:max-w-[900px]" />
          </Box>
        </Container>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section>
        <Container>
          <Box className="text-muted flex h-[200px] items-center justify-center">
            No images found
          </Box>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        <Box className="flex justify-center">
          {/* Mobile: Slider */}
          <Box className="relative block w-[350px] overflow-hidden md:hidden">
            <Slider
              autoScroll={false}
              className="h-[200px] w-full"
              itemWidth={350}
              gap={0}
              pagination
              pages={items.map(
                (item: { metaUrl: string }) => `/event/${item.metaUrl}`
              )}>
              {items.map((item: { url: string }, i: number) => (
                <Image
                  key={i}
                  src={item.url}
                  alt={`Image ${i + 1}`}
                  width={350}
                  height={200}
                  className="h-full w-full object-cover"
                  draggable={false}
                  unoptimized
                />
              ))}
            </Slider>
          </Box>

          {/* Desktop: Carousel */}
          <Box className="hidden md:block">
            <Carousel
              images={items.map((item: { url: string }) => item.url)}
              pages={items.map(
                (item: { metaUrl: string }) => `/event/${item.metaUrl}`
              )}
              width={800}
              height={456}
              sizes="(min-width: 1024px) 800px, (min-width: 768px) 550px"
              className="h-[200px] w-[350px] max-w-full sm:h-[300px] sm:w-[450px] md:h-[350px] md:w-[550px] lg:h-[450px] lg:w-[800px] xl:h-[500px] xl:max-w-[900px]"
            />
          </Box>
        </Box>
      </Container>
    </section>
  );
}
