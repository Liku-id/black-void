import React from 'react';
import { Box, Container, Typography } from '@/components';

const WhoWeAreSection = () => {
  return (
    <section className="pt-16 pb-8 md:pt-32 md:pb-16 px-4 md:px-0">
      <Container>
        <Box className="flex flex-col items-center">
          <Typography
            type="heading"
            as="h1"
            size={32}
            className="mb-10 text-white font-bold text-[23px] md:text-[32px]"
          >
            Who we are?
          </Typography>

          <Box className="mx-auto w-full max-w-[653px] border border-black bg-white p-6 shadow-[4px_4px_0px_0px_#FFFFFF] text-black">
            <Typography
              className="text-[12px] md:text-[14px]"
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
        </Box>
      </Container>
    </section>
  );
};

export default WhoWeAreSection;
