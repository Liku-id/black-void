import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@/components';
import collaborationImage from '@/assets/images/tambahan-modal-usaha-collaboration.webp';
import fundingIcon from '@/assets/icons/funding.svg';
import moneyIcon from '@/assets/icons/money.svg';
import safeIcon from '@/assets/icons/safe.svg';
import { useTranslations } from 'next-intl';

const CollaborationSection = () => {
  const t = useTranslations("eventFunding");
  const items = [
    {
      title: t("collaboration.items.1.title"),
      description: t("collaboration.items.1.description"),
      icon: fundingIcon,
    },
    {
      title: t("collaboration.items.2.title"),
      description: t("collaboration.items.2.description"),
      icon: moneyIcon,
    },
    {
      title: t("collaboration.items.3.title"),
      description: t("collaboration.items.3.description"),
      icon: safeIcon,
    },
  ];

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
            {t("collaboration.title")}
          </Typography>
          <Typography
            type="body"
            size={14}
            className="max-w-3xl mx-auto text-white opacity-80"
            dangerouslySetInnerHTML={{
              __html: `${t("collaboration.description")}`
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
                    src={item.icon}
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
