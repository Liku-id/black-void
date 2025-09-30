'use client';
import { Box, Container, Typography } from '@/components';

export default function AboutUs() {
  return (
    <section className="bg-black py-6">
      <Container>
        <Box className="mx-auto w-[653px] border border-black bg-white p-6 shadow-[4px_4px_0px_0px_#FFFFFF]">
          <Typography
            as="h1"
            type="heading"
            size={26}
            className="mb-6 text-center uppercase">
            all about wukong
          </Typography>

          <Typography
            size={14}
            dangerouslySetInnerHTML={{
              __html: `
                At <strong>Wukong</strong>, our journey starts with a simple idea: <u>true change begins when people come together</u>.
                <br /><br />
                Inspired by the meaning of our name—<u>"awakened to emptiness"</u>—we believe in creating space for new experiences, voices, and ideas through events. <strong>Wukong</strong> isn't just a ticketing company. We're on a mission to transform the world, one gathering at a time. By harnessing smart technology and a philosophy rooted in openness, we make it easier for organizers and attendees to connect, share, and inspire. From local gatherings to global movements, we help everyone find their place and purpose.
                <br /><br />
                Join us in building communities that <u>matter</u>. Together, with awareness and intention, we can awaken the world to new possibilities.
              `,
            }}
          />
        </Box>
      </Container>
    </section>
  );
}
