import React from 'react';
import Image from 'next/image';
import { Box, Button, Typography } from '@/components';
import {
  formatRupiah,
  formatStrToHTML,
  getTodayWIBString,
} from '@/utils/formatter';
import ticketIcon from '@/assets/icons/ticket.svg';
import type { Ticket } from '../types';

const MAX_DESC_LENGTH = 120;

interface TicketCardProps {
  ticket: Ticket;
  count: number;
  onChange: (id: string, delta: number) => void;
  isActive: boolean;
  isOtherActive: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  count,
  onChange,
  isActive,
  isOtherActive,
}) => {
  // Initialize State
  const [showFull, setShowFull] = React.useState(false);
  const isTruncated = (ticket.description ?? '').length > MAX_DESC_LENGTH;
  const displayDesc =
    showFull || !isTruncated
      ? (ticket.description ?? '')
      : (ticket.description ?? '').slice(0, MAX_DESC_LENGTH) + '...';
  const minusDisabled = count === 0;
  const available = Math.max(
    0,
    (ticket.quantity ?? 0) - (ticket.purchased_amount ?? 0)
  );
  const plusDisabled =
    count >= (ticket.max_order_quantity ?? Infinity) || count >= available;

  // Check if sales period has ended
  const today = getTodayWIBString();
  const isSalesEnded = ticket.sales_end_date && today > ticket.sales_end_date;

  // Card shadow logic
  const cardClass = [
    'mt-6 lg:mt-4 border border-[var(--color-gray)] bg-white p-[14px] transition-shadow',
    isActive ? 'shadow-[4px_4px_0px_0px_#000]' : '',
    !isActive && !isOtherActive ? 'hover:shadow-[4px_4px_0px_0px_#000]' : '',
  ].join(' ');

  return (
    <Box className={cardClass}>
      <Box className="mb-4 flex items-center justify-between">
        <Box className="flex items-center">
          <Image
            src={ticketIcon}
            alt="ticket"
            width={24}
            height={24}
            className="mr-2 invert"
          />
          <Typography type="heading" color="text-black" size={26}>
            {ticket.name}
          </Typography>
        </Box>
        <Typography
          type="body"
          color="text-black"
          size={18}
          className="font-bold"
        >
          {ticket.price === 0 ? 'Free' : formatRupiah(ticket.price)}
        </Typography>
      </Box>
      <Typography
        type="body"
        size={14}
        className={`my-3 ${!showFull ? 'max-h-[125px] overflow-hidden' : ''}`}
        dangerouslySetInnerHTML={{
          __html: formatStrToHTML(displayDesc),
        }}
      />

      {isTruncated && (
        <Typography
          type="body"
          size={14}
          color="text-black"
          className="mt-2 cursor-pointer underline"
        >
          <span onClick={() => setShowFull(!showFull)}>
            {showFull ? 'Show less' : 'See detail'}
          </span>
        </Typography>
      )}

      <Box className="mt-4 flex items-center">
        <Image
          src={ticketIcon}
          alt="ticket"
          width={18}
          height={18}
          className="mr-2 invert"
        />
        <Typography type="body" size={10} color="text-muted">
          Refund not Allowed
        </Typography>
      </Box>

      <hr className="border-muted my-3" />

      {available <= 0 || isSalesEnded ? (
        <Button
          id={`${ticket.name}_sold`}
          className="bg-gray font-bebas w-full cursor-not-allowed text-[22px] font-light text-black uppercase disabled:opacity-100"
          disabled
          aria-disabled="true"
          type="button"
        >
          SOLD
        </Button>
      ) : (
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-4">
            <Typography type="heading" size={20}>
              TOTAL TICKETS
            </Typography>
            {(count >= (ticket.max_order_quantity ?? Infinity) ||
              (ticket.quantity ?? 0) <=
                (ticket.purchased_amount ?? 0) + count) && (
              <Typography type="body" size={10} color="text-red">
                Maximum purchase limit reached
              </Typography>
            )}
          </Box>

          <Box className="flex items-center gap-2">
            <Button
              id={`${ticket.name}_ticket_minus_icon`}
              className={`flex h-8 w-8 items-center justify-center text-lg ${minusDisabled ? 'text-gray cursor-not-allowed border bg-white' : 'bg-black text-white'}`}
              onClick={() => onChange(ticket.id, -1)}
              disabled={minusDisabled}
              type="button"
            >
              -
            </Button>
            <span className="w-6 text-center">{count}</span>
            <Button
              id={`${ticket.name}_ticket_plus_icon`}
              className={`flex h-8 w-8 items-center justify-center text-lg ${plusDisabled ? 'text-gray cursor-not-allowed border bg-white' : 'bg-black text-white'}`}
              onClick={() => onChange(ticket.id, 1)}
              disabled={plusDisabled}
              type="button"
            >
              +
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TicketCard;
