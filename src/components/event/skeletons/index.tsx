import React from 'react';
import { Box, Container } from '@/components';

const EventPageSkeleton = () => (
  <Container className="min-h-[1200px]">
    <Box className="mb-14 h-[353px] w-full animate-pulse rounded bg-gray-200 px-4" />
    <Box>
      <Box className="min-h-[180px] w-[534px]">
        <Box className="mb-4 h-10 w-2/3 animate-pulse rounded bg-gray-200" />
        <Box className="grid grid-cols-2 gap-16">
          {[0, 1].map(col => (
            <Box key={col}>
              {[0, 1].map(row => (
                <Box
                  key={row}
                  className={`flex items-center gap-2${row === 0 ? 'mb-4' : ''}`}>
                  <Box className="h-6 w-6 animate-pulse rounded bg-gray-100" />
                  <Box
                    className={`h-6 ${col === 0 ? (row === 0 ? 'w-32' : 'w-24') : row === 0 ? 'w-40' : 'w-32'} animate-pulse rounded bg-gray-100`}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Box className="mb-4 h-6 w-1/4 animate-pulse rounded bg-gray-200" />
        <Box className="mb-4 h-16 w-full animate-pulse rounded bg-gray-100" />
      </Box>
    </Box>
    <Box className="mb-6 flex min-h-[44px] gap-4">
      {[...Array(3)].map((_, i) => (
        <Box key={i} className="h-8 w-24 animate-pulse rounded bg-gray-100" />
      ))}
    </Box>
    <Box className="min-h-[420px] space-y-4">
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          className="h-40 w-full animate-pulse rounded bg-gray-100"
        />
      ))}
    </Box>
  </Container>
);

export default EventPageSkeleton;
