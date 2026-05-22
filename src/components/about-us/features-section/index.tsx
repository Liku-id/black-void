import Image from 'next/image';
import { Box, Container, Typography } from '@/components';
import { cn } from '@/utils/utils';
import singleIcon from '@/assets/icons/single.svg';
import groupIcon from '@/assets/icons/group.svg';
import privateIcon from '@/assets/icons/private.svg';
import additionalFormImg from '@/assets/images/additional-form.webp';
import groupTicketImg from '@/assets/images/group-ticket.webp';
import privateLinkImg from '@/assets/images/private-link.webp';
import { getTranslations } from 'next-intl/server';

const FeaturesSection = async () => {
  const t = await getTranslations('aboutUs');

  const features = [
    {
      title: t('features.items.1.title'),
      description: t('features.items.1.desc'),
      align: 'left',
      icon: singleIcon,
      image: additionalFormImg,
    },
    {
      title: t('features.items.2.title'),
      description: t('features.items.2.desc'),
      align: 'right',
      icon: groupIcon,
      image: groupTicketImg,
    },
    {
      title: t('features.items.3.title'),
      description: t('features.items.3.desc'),
      align: 'left',
      icon: privateIcon,
      image: privateLinkImg,
    },
  ];
  return (
    <section className="pb-16 xl:pb-32 px-4 xl:px-0">
      <Container>
        {/* Header */}
        <Box className="mb-8 mb-16 text-center">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="mb-4 text-white text-[23px] xl:text-[32px]"
          >
            {t('features.title')}
          </Typography>
          <Typography
            type="body"
            size={18}
            className="text-white opacity-80 text-[14px] xl:text-[18px]"
          >
            {t('features.desc')}
          </Typography>
        </Box>

        {/* Features List */}
        <Box className="flex flex-col gap-12 xl:gap-[128px]">
          {features.map((feature, index) => (
            <Box
              key={index}
              className={cn(
                "grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-16 items-center",
              )}
            >
              {/* Text Block */}
              <Box
                className={cn(
                  "flex flex-col justify-center items-center text-center xl:items-start xl:text-left",
                  feature.align === 'right' ? 'xl:order-2' : 'xl:order-1'
                )}
              >
                <Box className="mb-4 relative w-20 h-20">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </Box>
                <Typography
                  type="heading"
                  as="h3"
                  size={24}
                  className="mb-4 text-white text-[18px] xl:text-[24px]"
                >
                  {feature.title}
                </Typography>
                <Typography
                  type="body"
                  size={16}
                  className="text-white opacity-80 max-w-md text-[14px] xl:text-[16px]"
                >
                  {feature.description}
                </Typography>
              </Box>

              {/* Image Block */}
              <Box
                className={cn(
                  "flex items-center justify-center",
                  feature.align === 'right' ? 'xl:order-1' : 'xl:order-2'
                )}
              >
                <Box className="relative w-full max-w-[490px] aspect-[490/230]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 490px"
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </section>
  );
};

export default FeaturesSection;
