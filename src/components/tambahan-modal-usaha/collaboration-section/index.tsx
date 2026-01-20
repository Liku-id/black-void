import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@/components';
import collaborationImage from '@/assets/images/tambahan-modal-usaha-collaboration.webp';
import sunflowerIcon from '@/assets/icons/sunflower.svg';

const items = [
  {
    title: 'funding through securities crowdfunding schemes',
    description: 'Together with EKUID, Wukong facilitates your ideas to become reality by helping you with funding that safe and reliable',
  },
  {
    title: 'funding for your event up to IDR 10 billion*',
    description: 'Securities Crowdfunding schemes designed to match your event scale and operational requirements.',
  },
  {
    title: 'safe and OJK licensed platform',
    description: 'EKUID is a safe and trusted funding platform that has permission and is licensed by the OJK',
  },
];

const CollaborationSection = () => {
  return (
    <section className="px-4 xl:px-0 pt-16 pb-8 lg:pt-[120px] lg:pb-[60px]">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center mb-12">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="mb-6 text-[23px] lg:text-[32px] text-white uppercase max-w-4xl"
          >
            WUkong collaborated with ekuid to make your ideas come true
          </Typography>
          <Typography
            type="body"
            size={14}
            className="max-w-3xl mx-auto text-white opacity-80"
            dangerouslySetInnerHTML={{
              __html: `<strong>Wukong collaborated with EKUID</strong> to helps event organizers access funding while managing ticket sales seamlessly. From planning to post-event settlement, everything is connected`
            }}
          />
        </Box>

        {/* Content Grid */}
        <Box className="grid grid-cols-1 xl:grid-cols-2 gap-[40px]">
          {/* Left: Image */}
          <Box className="relative w-full h-[240px] md:h-[346px] xl:h-[400px]">
            <Image
              src={collaborationImage}
              alt="Collaboration"
              fill
              className="object-cover"
            />
          </Box>

          {/* Right: Points */}
          <Box className="flex flex-col gap-8">
            {items.map((item, index) => (
              <Box key={index} className="flex gap-4 items-start">
                <Box className="shrink-0 relative w-[60px] h-[60px] md:w-[80px] md:h-[80px]">
                  <Image
                    src={sunflowerIcon}
                    alt="Icon"
                    fill
                    className="object-contain"
                  />
                </Box>
                <Box>
                  <Typography
                    type="heading"
                    as="h3"
                    size={24}
                    className="mb-2 text-white text-[18px] md:text-[24px] uppercase"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    type="body"
                    size={14}
                    className="text-white opacity-80 leading-relaxed"
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default CollaborationSection;
