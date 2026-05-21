import Image from 'next/image';
import { Box, Container, Typography } from '@/components';
import moneyIcon from '@/assets/icons/money.svg';
import windowIcon from '@/assets/icons/window.svg';
import withdrawalIcon from '@/assets/icons/withdrawal.svg';
import { getTranslations } from 'next-intl/server';

const FinancialSection = async () => {
  const t = await getTranslations('aboutUs.financial');

  const items = [
    {
      title: t('items.1.title'),
      description: t('items.1.desc'),
      icon: moneyIcon,
    },
    {
      title: t('items.2.title'),
      description: t('items.2.desc'),
      icon: windowIcon,
    },
    {
      title: t('items.3.title'),
      description: t('items.3.desc'),
      icon: withdrawalIcon,
    },
  ];

  return (
    <section className="pb-16 lg:pb-32 bg-black text-white px-4 xl:px-0">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="mb-6 text-[23px] lg:text-[32px]"
          >
            {t('title')}
          </Typography>
          <Typography
            type="body"
            size={14}
            className="mb-[55px] max-w-[354px] lg:max-w-3xl mx-auto opacity-80"
          >
            {t('desc')}
          </Typography>
        </Box>

        {/* Grid Items */}
        <Box className="grid grid-cols-1 xl:grid-cols-3 gap-12 xl:gap-[80px]">
          {items.map((item, index) => (
            <Box key={index} className="flex flex-col items-center text-center max-w-[354px] mx-auto w-full">
              {/* Icon */}
              <Box className="mb-[56px] h-[80px] w-[80px] flex items-center justify-center relative">
                <Image
                  src={item.icon}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </Box>

              <Typography
                type="heading"
                as="h3"
                size={18}
                className="mb-4"
              >
                {item.title}
              </Typography>

              <Typography
                type="body"
                size={14}
                className="opacity-80 leading-relaxed"
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

export default FinancialSection;
