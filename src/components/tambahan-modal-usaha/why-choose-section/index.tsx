import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@/components';

import moneyIcon from '@/assets/icons/money.svg';
import sunflowerIcon from '@/assets/icons/sunflower.svg';
import magnifierIcon from '@/assets/icons/magnifier.svg';
import windowIcon from '@/assets/icons/window.svg';

const items = [
  {
    icon: moneyIcon,
    title: 'Reduce upfront financial burden',
    description: 'Minimize initial costs and manage cash flow more effectively before ticket sales begin',
  },
  {
    icon: sunflowerIcon,
    title: 'Transparent Funding tracking',
    description: 'Monitor sales and revenue in real time with clear and accurate financial insights.',
  },
  {
    icon: magnifierIcon,
    title: 'reliable funding schemes',
    description: 'A reliable securities crowdfunding method. EKUID has a funding success rate of up to 100%.',
  },
  {
    icon: windowIcon,
    title: 'Integrated with ticket sales and reporting',
    description: 'Funding, ticket sales, and reports are managed seamlessly in one unified system',
  },
];

const WhyChooseSection = () => {
  return (
    <section className="px-4 md:px-0 py-12 md:py-16 lg:py-24">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center mb-[56px]">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="text-white font-normal"
          >
            Why Choose WUKONG for wu Event Funding Solution
          </Typography>
        </Box>

        {/* Content Grid */}
        <Box className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[40px]">
          {items.map((item, index) => (
            <Box key={index} className="flex flex-col items-center text-center">
              {/* Icon */}
              <Box className="relative w-[80px] h-[80px] mb-[56px]">
                <Image
                  src={item.icon}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </Box>

              {/* Title */}
              <Typography
                type="heading"
                as="h3"
                size={24}
                className="mb-2 text-white font-normal capitalize"
              >
                {item.title}
              </Typography>

              {/* Description */}
              <Typography
                type="body"
                size={14}
                className="text-white opacity-80 font-normal"
              >
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </section>
  );
};

export default WhyChooseSection;
