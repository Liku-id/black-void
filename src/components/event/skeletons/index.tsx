import React from 'react';
import { Box, Container } from '@/components';

const EventPageSkeleton = () => (
  <Container className="min-h-[1000px] px-4 lg:min-h-[1200px] lg:px-8 xl:px-0">
    <Box className="mb-10 grid w-full grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[450px_1fr] xl:grid-cols-[610px_1fr] xl:gap-6">
      <Box className="h-[210px] w-full animate-pulse bg-gray-200 lg:h-[353px]" />
      <Box className="hidden h-[273px] lg:h-[353px] w-full animate-pulse bg-gray-200 lg:block" />
    </Box>


    <Box className="bg-light-gray mb-8 h-[425px] w-full animate-pulse" />

    <Box className="bg-light-gray mb-4 h-[225px] w-full animate-pulse" />
  </Container>
);

export default EventPageSkeleton;
