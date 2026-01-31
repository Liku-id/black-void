'use client';

import { Container, Box, Carousel, Slider } from '@/components';
import Image from 'next/image';

interface CarouselItem {
  url: string;
  metaUrl: string;
}

interface CarouselSectionProps {
  items?: CarouselItem[];
}

export default function CarouselSection({ items = [] }: CarouselSectionProps) {
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
              className="h-[224px] w-full"
              itemWidth={350}
              gap={0}
              pagination
              pages={items.map((item) => `/event/${item.metaUrl}`)}
              itemIds={items.map(
                (item) => `btn_home_banner_${item.metaUrl}`
              )}>
              {items.map((item, i) => (
                <Image
                  key={i}
                  src={item.url}
                  alt={`Image ${i + 1}`}
                  width={350}
                  height={200}
                  className="h-full w-full object-cover"
                  draggable={false}
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  // @ts-ignore
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                />
              ))}
            </Slider>
          </Box>

          {/* Desktop: Carousel */}
          <Box className="hidden md:block">
            <Carousel
              images={items.map((item) => item.url)}
              pages={items.map((item) => `/event/${item.metaUrl}`)}
              linkIds={items.map(
                (item) => `btn_home_banner_${item.metaUrl}`
              )}
              width={800}
              height={456}
              sizes="(min-width: 1024px) 800px, (min-width: 768px) 550px"
              className="h-[200px] w-[350px] max-w-full sm:h-[300px] sm:w-[450px] md:h-[350px] md:w-[550px] lg:h-[450px] lg:w-[800px] xl:h-[500px] xl:max-w-[900px]"
              priority={true}
            />
          </Box>
        </Box>
      </Container>
    </section>
  );
}
