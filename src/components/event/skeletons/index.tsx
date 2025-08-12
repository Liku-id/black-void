import React from 'react';
import { Box, Container } from '@/components';

const EventPageSkeleton = () => (
  <Container className="min-h-[1000px] px-4 lg:min-h-[1200px] lg:px-8 xl:px-0">
    <Box className="mb-10 grid w-full grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[450px_1fr] xl:grid-cols-[630px_1fr] xl:gap-14">
      <Box className="h-[210px] w-full animate-pulse bg-gray-200 lg:h-[353px]" />
      <Box className="hidden h-[273px] w-full animate-pulse bg-gray-200 lg:block" />
    </Box>

    <Box className="grid grid-cols-1 gap-10 lg:mb-8 lg:grid-cols-2 lg:gap-16">
      <Box>
        <Box className="mb-2 h-10 w-2/3 animate-pulse bg-gray-200 lg:mb-4" />
        <Box className="mb-2 h-4 w-1/3 animate-pulse bg-gray-200 lg:mb-4 lg:h-6" />
        <Box className="mb-2 h-4 w-2/3 animate-pulse bg-gray-200 lg:mb-4 lg:h-6" />
        <Box className="mb-2 block h-4 w-1/3 animate-pulse bg-gray-200 lg:mb-4 lg:hidden lg:h-6" />
        <Box className="block h-4 w-2/3 animate-pulse bg-gray-200 lg:hidden lg:h-6" />
      </Box>
      <Box className="mb-10 block lg:hidden">
        <Box className="m-auto mb-12 flex h-10 w-[140px] animate-pulse bg-gray-200 text-center" />
        <Box className="mb-2 h-4 w-1/3 animate-pulse bg-gray-200 lg:h-6" />
        <Box className="mb-2 h-4 w-2/3 animate-pulse bg-gray-200 lg:h-6" />
      </Box>
    </Box>

    <Box className="bg-light-gray mb-8 h-[425px] w-full animate-pulse" />

    <Box className="bg-light-gray mb-4 h-[225px] w-full animate-pulse" />
  </Container>
);

export default EventPageSkeleton;
