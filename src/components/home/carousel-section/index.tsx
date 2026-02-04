'use client';

import { Container, Box, Carousel, Slider } from '@/components';
import Image from 'next/image';

interface CarouselItem {
  url: string;
  metaUrl: string;
  status?: string;
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
              className="w-full"
              itemWidth={350} // Fixed width 350
              gap={0}
              pagination
              pages={items.map((item) => `/event/${item.metaUrl}`)}
              itemIds={items.map(
                (item) => `btn_home_banner_${item.metaUrl}`
              )}
              clickableItems={items.map((item) => item.status === 'on_going')}>
              {items.map((item, i) => (
                <Box key={i} className="relative w-full h-[208px]">
                  <Image
                    src={item.url}
                    alt={`Image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 350px, 50vw"
                    className="object-cover"
                    draggable={false}
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    // @ts-ignore
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                  />
                </Box>
              ))}
            </Slider>
          </Box>

          {/* Desktop: Carousel */}
          <Box className="hidden justify-center md:flex">
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
