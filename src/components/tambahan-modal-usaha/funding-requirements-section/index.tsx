import React from 'react';
import { Box, Container, Typography } from '@/components';

const items = [
  {
    label: 'Company',
    value: 'non-public company<br/>(PT TERTUTUP)',
  },
  {
    label: 'Company Form',
    value: 'non-conglomerate companies',
  },
  {
    label: 'Paid-up capital',
    value: '≤ IDR 30.000.000.000',
  },
];

const FundingRequirementsSection = () => {
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
            Funding Requirements
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
