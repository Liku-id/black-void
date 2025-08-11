import React from 'react';
import { Box, Typography } from '@/components';
import { formatRupiah } from '@/utils/formatter';
import type { TicketSummary } from '../types';

const TicketList: React.FC<{ tickets: TicketSummary[] }> = ({ tickets }) => (
  <Box className="mb-3 lg:mb-4">
    {tickets.map((t, idx) => (
      <Box
        key={t.id}
        className={`border-l-2 border-black pl-2 ${idx > 0 ? 'mt-4' : ''}`}>
        <Typography type="heading" size={22} className="leading-none">
          {t.name}
        </Typography>
        <Box className="mt-1 flex items-center justify-between lg:mt-2">
          <Typography
            type="body"
            size={12}
            color="text-muted"
            className="font-light">
            Total: {t.count} Tickets
          </Typography>
          <Typography
            type="body"
            size={12}
            color="text-black"
            className="font-light">
            Subtotal:{' '}
            <span className="font-bold">
              {formatRupiah(Number(t.price) * t.count)}
            </span>
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

export default TicketList;
