import { Container, Typography, Slider } from '@/components';
import CreatorCard from '../creator-card';

const creators = [
  {
    id: 1,
    name: 'Creator 1',
    logo: 'https://dummyimage.com/80x80/4ECDC4/FFFFFF.png&text=C1',
  },
  {
    id: 2,
    name: 'Creator 2',
    logo: 'https://dummyimage.com/80x80/45B7D1/FFFFFF.png&text=C2',
  },
  {
    id: 3,
    name: 'Creator 3',
    logo: 'https://dummyimage.com/80x80/96CEB4/FFFFFF.png&text=C3',
  },
  {
    id: 4,
    name: 'Creator 1',
    logo: 'https://dummyimage.com/80x80/4ECDC4/FFFFFF.png&text=C4',
  },
  {
    id: 5,
    name: 'Creator 2',
    logo: 'https://dummyimage.com/80x80/45B7D1/FFFFFF.png&text=C5',
  },
  {
    id: 6,
    name: 'Creator 3',
    logo: 'https://dummyimage.com/80x80/96CEB4/FFFFFF.png&text=C6',
  },
];

export default function CreatorListSection() {
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

        <Slider autoScroll={true} scrollInterval={3000} gap={6} itemWidth={100}>
          {creators.map(creator => (
            <CreatorCard
              key={creator.id}
              logo={creator.logo}
              name={creator.name}
            />
          ))}
        </Slider>
      </Container>
    </section>
  );
}
