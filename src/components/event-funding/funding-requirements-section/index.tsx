import { useTranslations } from 'next-intl';
import { Box, Container, Typography } from '@/components';

const FundingRequirementsSection = () => {
  const t = useTranslations('eventFunding.fundingRequirements');
  const items = [
    {
      label: t('items.1.title'),
      value: t('items.1.desc'),
    },
    {
      label: t('items.2.title'),
      value: t('items.2.desc'),
    },
    {
      label: t('items.3.title'),
      value: t('items.3.desc'),
    },
  ];

  return (
    <section className="pb-12 md:pb-16 px-4 md:px-0 lg:pb-[120px]">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center mb-[56px]">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="text-[32px] text-white font-normal"
          >
            {t('title')}
          </Typography>
        </Box>

        {/* Content */}
        <Box className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-[150px]">
          {items.map((item, index) => (
            <Box key={index} className="flex flex-col items-center text-center max-w-[250px]">
              <Typography
                type="body"
                size={14}
                className="mb-4 text-white text-[14px] font-normal opacity-80"
              >
                {item.label}
              </Typography>
              <Typography
                type="heading"
                size={24}
                className="text-white font-normal capitalize"
                dangerouslySetInnerHTML={{ __html: item.value }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </section>
  );
};

export default FundingRequirementsSection;
