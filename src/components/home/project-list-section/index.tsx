import { Container, Box, Typography, TextField } from '@/components';
import ProjectCard from '../project-card';
import locationIcon from '@/assets/icons/location.svg';
import calendarIcon from '@/assets/icons/calendar.svg';

const dummyProjects = [
  {
    image: 'https://dummyimage.com/400x200/FF6B6B/FFFFFF.png&text=Music+Festival',
    title: 'International Music Festival Jakarta 2024 - The Ultimate Experience',
    location: 'Gelora Bung Karno Stadium',
    date: '12 Aug 2024',
    price: 'Rp 1.500.000',
  },
  {
    image: 'https://dummyimage.com/400x200/4ECDC4/FFFFFF.png&text=Art+Expo',
    title: 'Contemporary Art Exhibition & Creative Workshop Series',
    location: 'Bandung',
    date: '20 Sep 2024',
    price: 'Rp 2.000.000',
  },
  {
    image: 'https://dummyimage.com/400x200/45B7D1/FFFFFF.png&text=Startup+Summit',
    title: 'Indonesia Tech Startup Summit & Innovation Conference 2024',
    location: 'Surabaya',
    date: '5 Oct 2024',
    price: 'Rp 3.500.000',
  },
  {
    image: 'https://dummyimage.com/400x200/96CEB4/FFFFFF.png&text=Art+Expo',
    title: 'Modern Art Gallery Opening & Artist Meet & Greet Session',
    location: 'Bandung',
    date: '20 Sep 2024',
    price: 'Rp 1.800.000',
  },
];

export default function ProjectListSection() {
  return (
    <section id="project-list" className="my-8 md:my-24">
      <Container className='px-4'>
        <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[20px] mb-8">
          <Typography
            as="h2"
            type="heading"
            size={22}
            color="text-white"
            className="font-bebas mr-0 sm:mr-2"
          >
            Filter Event:
          </Typography>
          <TextField placeholder="1" startIcon={locationIcon} />
          <TextField placeholder="2" startIcon={calendarIcon} />
          <TextField placeholder="3" className='w-[231px]'/>
        </Box>
        
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
          {dummyProjects.map((project, idx) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </Box>
      </Container>
    </section>
  );
} 