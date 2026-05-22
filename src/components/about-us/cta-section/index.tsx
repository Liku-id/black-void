import Link from 'next/link';
import { Box, Container, Typography } from '@/components';
import { buttonVariants } from '@/components/common/button';
import { getTranslations } from 'next-intl/server';

const CTASection = async () => {
  const t = await getTranslations("aboutUs.cta")
  return (
    <section className="pb-16 lg:pb-32 bg-black text-white px-4 xl:px-0">
      <Container>
        <Box className="flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-16">
          {/* Left Content (Text) */}
          <Box className="text-center xl:text-left max-w-2xl">
            <Typography
              type="heading"
              as="h2"
              size={32}
              className="mb-4 uppercase text-[23px] xl:text-[32px]"
            >
              {t('title')}
            </Typography>
            <Typography
              type="body"
              size={18}
              className="mb-4 opacity-80 text-[14px] xl:text-[18px]"
            >
              {t("desc")}
            </Typography>
            <Typography
              type="body"
              size={18}
              className="opacity-80 text-[14px] xl:text-[18px]"
            >
              {t('ready')}
            </Typography>
          </Box>

          {/* Right Content (Buttons) */}
          <Box className="flex flex-col md:flex-row gap-4 items-center md:items-start w-auto">
            <Link
              href="https://bo.wukong.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ className: "w-auto text-[14px] xl:text-[16px]" })}
            >
              {t('button_create')}
            </Link>
            <Link
              href="https://wa.me/6285121328284"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ className: "w-auto text-[14px] xl:text-[16px]" })}
            >
              {t('button_talk')}
            </Link>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default CTASection;
