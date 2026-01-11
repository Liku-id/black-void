import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@/components';
import competitiveFeeIcon from '@/assets/images/competitive-fee.svg';
import multipaymentIcon from '@/assets/images/multipayment-gateway.svg';
import withdrawalIcon from '@/assets/images/flexible-withdrawal.svg';

const items = [
  {
    title: 'Competitive Fee',
    description: 'Enterprise-ready pricing designed to optimize cost efficiency at scale without compromising service quality',
    icon: competitiveFeeIcon,
  },
  {
    title: 'Multi Payment Gateway',
    description: 'Support for multiple secure and trusted payment gateways to ensure reliable transactions and higher success rates',
    icon: multipaymentIcon,
  },
  {
    title: 'Flexible Withdrawal',
    description: 'Flexible fund disbursement options designed to align with enterprise cash flow and financial operations',
    icon: withdrawalIcon,
  },
];

const FinancialSection = () => {
  return (
    <section className="pb-16 lg:pb-32 bg-black text-white px-4 xl:px-0">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="mb-6 font-bold text-[23px] lg:text-[32px]"
          >
            Transparent and Reliable Financial Reporting
          </Typography>
          <Typography
            type="body"
            size={14}
            className="mb-[55px] max-w-[354px] lg:max-w-3xl mx-auto opacity-80"
          >
            From sales to settlements, manage your event finances with ease. Clear insights ensure full control and transparency
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
                className="mb-4 font-bold"
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
