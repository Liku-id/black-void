import { Box, Container, Typography } from '@/components';
import { getTranslations } from 'next-intl/server';

const WhoWeAreSection = async () => {
  const t = await getTranslations('aboutUs');
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
            {t('who_we_are')}
          </Typography>

          <Box className="mx-auto w-full max-w-[653px] border border-black bg-white p-6 shadow-[4px_4px_0px_0px_#FFFFFF] text-black">
            <Typography
              className="text-[12px] md:text-[14px]"
              dangerouslySetInnerHTML={{
                __html: t.raw('who_we_are_desc'),
              }}
            />
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default WhoWeAreSection;
