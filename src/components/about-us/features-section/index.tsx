import React from 'react';
import { Box, Container, Typography } from '@/components';
import { cn } from '@/utils/utils';

const features = [
  {
    title: 'Special leads Requirement',
    description: 'Capture valuable attendee data with custom requirements that support smarter targeting and follow-ups',
    align: 'left',
  },
  {
    title: 'Group Ticket',
    description: 'Boost sales by offering group deals that make it easy for teams and communities to buy together',
    align: 'right',
  },
  {
    title: 'Private Link Ticket',
    description: 'Drive exclusivity and conversions with private ticket links for partners, VIPs, or targeted audiences',
    align: 'left',
  },
];

const FeaturesSection = () => {
  return (
    <section className="pb-16 xl:pb-32 px-4 xl:px-0">
      <Container>
        {/* Header */}
        <Box className="mb-8 xl:mb-32 text-center">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="mb-4 text-white font-bold text-[23px] xl:text-[32px]"
          >
            All in one feature for your event marketing
          </Typography>
          <Typography
            type="body"
            size={18}
            className="text-white opacity-80 text-[14px] xl:text-[18px]"
          >
            Power your event marketing with powerfull features. Built for precise targeting and control
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
                <Typography
                  type="heading"
                  as="h3"
                  size={24}
                  className="mb-4 font-bold text-white text-[18px] xl:text-[24px]"
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

              {/* Image/Placeholder Block */}
              <Box
                className={cn(
                  "flex items-center justify-center",
                  feature.align === 'right' ? 'xl:order-1' : 'xl:order-2'
                )}
              >
                <Box className="bg-neutral-800 w-full max-w-[490px] h-[230px] rounded-lg animate-pulse" />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </section>
  );
};

export default FeaturesSection;
