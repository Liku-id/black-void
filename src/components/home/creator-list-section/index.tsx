'use client';
import useSWR from 'swr';
import { Container, Typography, Slider, Box } from '@/components';
import CreatorCard from '../creator-card';

export default function CreatorListSection() {
  const { data, isLoading } = useSWR('/api/event-organizers');

  const creators =
    data?.eventOrganizers?.map((org: any) => ({
      id: org.id,
      name: org.name,
      logo:
        org.asset_url ||
        'https://dummyimage.com/80x80/CCCCCC/666666.png&text=No+Image',
    })) || [];

  return (
    <section className="my-12 md:my-24">
      <Container className="px-4">
        <Typography
          as="h2"
          type="heading"
          size={32}
          color="text-white"
          className="font-bebas mb-8 leading-none">
          KREATOR WUKONG
        </Typography>

        {isLoading ? (
          <Box className="flex gap-6">
            {[...Array(6)].map((_, idx) => (
              <CreatorCard key={idx} skeleton />
            ))}
          </Box>
        ) : creators.length > 0 ? (
          <Slider autoScroll={false} gap={16} itemWidth={160}>
            {creators.map((creator: any) => (
              <CreatorCard
                key={creator.id}
                logo={creator.logo}
                name={creator.name}
              />
            ))}
          </Slider>
        ) : (
          <Box className="text-muted flex h-[120px] items-center justify-center">
            No creators found
          </Box>
        )}
      </Container>
    </section>
  );
}
