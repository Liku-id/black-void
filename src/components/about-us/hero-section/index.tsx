import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography, Button } from '@/components';
import hero from '@/assets/images/about-us-hero.webp';
import { getTranslations } from 'next-intl/server';

const HeroSection = async () => {
  const t = await getTranslations('aboutUs');

  return (
    <section className="relative w-full px-4 md:px-0">
      <Box className="relative h-[200px] w-full md:h-[552px] md:w-full md:max-w-[1232px] mx-auto lg:h-[552px]">
        <Image
          src={hero}
          alt="People creating together"
          fill
          className="object-cover"
          priority
        />
        <Box className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 px-4 pointer-events-none pt-0 md:pt-0">
          <Container className="pointer-events-auto">
            <Box className="text-center">
              <Typography
                type="heading"
                as="h1"
                size={46}
                className="mb-6 uppercase leading-tight text-white md:text-[46px] text-[23px]"
              >
                {t('hero_title.1')}<br />{t('hero_title.2')}
              </Typography>
              <Typography
                type="body"
                size={18}
                className="mb-0 md:mb-8 max-w-3xl mx-auto leading-relaxed text-white md:text-[18px] text-[12px]"
              >
                {t('hero_description.1')}<br />{t('hero_description.2')}
              </Typography>
              <Link href="https://wukong.co.id" className="hidden md:flex justify-center mt-8 md:mt-0">
                <Button
                  type="button"
                  className="mx-auto flex relative z-20 cursor-pointer"
                >
                  {t('hero_explore')}
                </Button>
              </Link>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Mobile Button (Outside Box) */}
      <Box className="flex md:hidden w-full mx-auto mt-6 justify-center">
        <Link href="https://wukong.co.id">
          <Button
            type="button"
            className="px-6 text-[14px] h-[40px]"
          >
            {t('hero_button')}
          </Button>
        </Link>
      </Box>
    </section>
  );
};

export default HeroSection;
