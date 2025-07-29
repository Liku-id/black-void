'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography, Button } from '@/components';
import Image from 'next/image';
import logo from '@/assets/logo/white-logo.svg';
import { QrCode } from 'lucide-react';
import successIcon from '@/assets/icons/success.svg';
import errorIcon from '@/assets/icons/error.svg';
import locationIcon from '@/assets/icons/location-pin.svg';
import calendarIcon from '@/assets/icons/calendar-days.svg';

 export default function TicketInfoCard({
  data,
}: {
  data: {
    status: 'success' | 'already_redeemed' | 'failed';
    fullName?: string;
    location?: string;
    eventDate?: string;
  };
}) {
  const isSuccess =
    data.status === 'success' || data.status === 'already_redeemed';

  return (
    <Box
      className={`rounded-t-2xl shadow-xl p-6 ${
        data.status === 'success'
          ? 'bg-white text-black'
          : data.status === 'already_redeemed'
            ? 'bg-yellow-100 text-yellow-900'
            : 'bg-red-50 text-red-900'
      }`}
    >
      {/* Status Message */}
      <Box className="flex items-center gap-2 mb-2">
        <Image
          src={data.status === 'success' ? successIcon : errorIcon}
          alt="status icon"
          width={24}
          height={24}
        />
        <Typography
          className={`text-xl font-semibold ${
            data.status === 'success'
              ? 'text-green-600'
              : data.status === 'already_redeemed'
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}
        >
          {data.status === 'success'
            ? 'Ticket Redeemed Successfully'
            : data.status === 'already_redeemed'
              ? 'Ticket Already Redeemed'
              : 'Ticket Redemption Failed'}
        </Typography>
      </Box>

      {/* Ticket Info */}
      {isSuccess && (
        <>
          <Typography type="heading" size={26} className="mb-1">
            {data.fullName}
          </Typography>
          <Box className="mt-4 mb-6 space-y-4">
            <Box className="flex items-center gap-3">
              <Image src={calendarIcon} alt="date" width={20} height={20} />
              <Typography size={14}>{data.eventDate}</Typography>
            </Box>
            <Box className="flex items-start gap-3">
              <Image src={locationIcon} alt="location" width={20} height={20} />
              <Typography size={14}>{data.location}</Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
