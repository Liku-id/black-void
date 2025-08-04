'use client';

import { Box, Typography, Button } from '@/components';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import successIcon from '@/assets/icons/success.svg';
import errorIcon from '@/assets/icons/error.svg';
import locationIcon from '@/assets/icons/location-pin.svg';
import calendarIcon from '@/assets/icons/calendar-days.svg';
import { formatDate } from '@/utils/formatter';

export default function TicketInfoCard({
  data,
  resetScanner,
}: {
  data: {
    status: 'success' | 'already_redeemed' | 'failed' | 'invalid_ticket';
    visitorName?: string;
    ticketName?: string;
    location?: string;
    eventDate?: string;
    ticketId?: string;
    message?: string;
  };
  resetScanner: () => void;
}) {
  const isSuccess = data.status === 'success';
  const isAlreadyRedeemed = data.status === 'already_redeemed';
  const isError = data.status === 'failed' || data.status === 'invalid_ticket';

  const getStatusColor = () => {
    if (isSuccess) return 'bg-white text-black';
    if (isAlreadyRedeemed) return 'bg-yellow-100 text-yellow-900';
    return 'bg-red-50 text-red-900';
  };

  const getStatusIcon = () => (isSuccess ? successIcon : errorIcon);

  const getStatusText = () => {
    if (isSuccess) return 'Ticket Redeemed Successfully';
    if (isAlreadyRedeemed) return 'Ticket Already Redeemed';
    if (data.status === 'invalid_ticket') return 'Invalid Ticket Status';
    return 'Ticket Redemption Failed';
  };

  const getStatusIconColor = () => {
    if (isSuccess) return 'text-green-600';
    if (isAlreadyRedeemed) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <Box className={`rounded-t-2xl shadow-xl p-6 ${getStatusColor()}`}>
      {/* Status Message */}
      <Box className="flex items-center gap-2 mb-4">
        <Image src={getStatusIcon()} alt="status icon" width={24} height={24} />
        <Typography className={`text-xl font-semibold ${getStatusIconColor()}`}>
          {getStatusText()}
        </Typography>
      </Box>

      {/* Error Message */}
      {isError && data.message && (
        <Box className="mb-4 p-3 bg-red-100 rounded-lg">
          <Typography size={14} className="text-red-800">
            {data.message}
          </Typography>
        </Box>
      )}

      {/* Ticket ID */}
      {data.ticketId && (
        <Box className="mb-4">
          <Typography size={12} className="text-gray-600 mb-1">
            Ticket ID
          </Typography>
          <Typography size={14} className="font-mono bg-gray-100 p-2 rounded">
            {data.ticketId}
          </Typography>
        </Box>
      )}

      {/* Ticket Info */}
      {(isSuccess || isAlreadyRedeemed) &&
        (data.visitorName || data.ticketName) && (
          <Box className="mb-6 space-y-3">
            {data.visitorName && (
              <Typography type="heading" size={22} className="font-semibold">
                Visitor: {data.visitorName}
              </Typography>
            )}

            {data.ticketName && (
              <Typography type="heading" size={18} className="text-gray-800">
                Ticket: {data.ticketName}
              </Typography>
            )}

            {data.eventDate && (
              <Box className="flex items-center gap-3 mt-2">
                <Image src={calendarIcon} alt="date" width={20} height={20} />
                <Typography size={14}>{formatDate(data.eventDate)}</Typography>
              </Box>
            )}

            {data.location && (
              <Box className="flex items-start gap-3 mt-2">
                <Image
                  src={locationIcon}
                  alt="location"
                  width={20}
                  height={20}
                />
                <Typography size={14}>{data.location}</Typography>
              </Box>
            )}
          </Box>
        )}

      {/* Success or Warning Message */}

      {/* Scan Another Ticket Button */}
      <Box className="flex mt-6">
        <Button
          onClick={resetScanner}
          className="flex-1 bg-white text-black hover:bg-gray-100 py-3 rounded-md"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Scan Another Ticket
        </Button>
      </Box>
    </Box>
  );
}
