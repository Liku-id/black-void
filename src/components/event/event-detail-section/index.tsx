'use client';
import React from 'react';
import { Carousel } from '@/components/common/carousel';
import { Box, Button, Slider, Typography } from '@/components';
import { EventData } from './event';
import Image from 'next/image';
import locationIcon from '@/assets/icons/location.svg';
import calendarIcon from '@/assets/icons/calendar.svg';
import ticketIcon from '@/assets/icons/ticket.svg';
import clockIcon from '@/assets/icons/clock.svg';
import { formatRupiah, formatDate, formatTime } from '@/utils/formatter';

interface EventDetailProps {
  data: EventData;
  onChooseTicket?: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ data, onChooseTicket }) => {
  const items = (data && data.eventAssets) || [];

  return (
    <section>
      <Box className="block md:hidden">
        <Slider
          autoScroll={false}
          className="h-[240px] w-full"
          itemWidth={375}
          pagination>
          {items.map((item: any, i: number) => (
            <Image
              key={i}
              src={item.asset.url}
              alt={`Image ${i + 1}`}
              width={375}
              height={240}
              className="object-cover"
              draggable={false}
              unoptimized
            />
          ))}
        </Slider>
      </Box>
      <Box className="hidden md:block">
        <Carousel
          images={items.map(
            (item: { asset: { url: string } }) => item.asset.url
          )}
          width={613}
          height={309}
          sizes="(min-width: 1440px) 613px, (min-width: 1024px) 448px, (min-width: 769px) 704px, 100vw"
          className="h-[353px] px-4"
          arrowPosition="inside"
        />
      </Box>

      <Box className="py-8 lg:py-14">
        <Box className="w-full lg:mb-14 lg:w-[534px]">
          <Typography
            type="heading"
            color="text-white"
            className="mb-2 text-[26px] lg:mb-4 lg:text-[30px]">
            {data.name}
          </Typography>
          <Box className="grid gap-2 lg:grid-cols-2 lg:gap-16">
            <Box>
              <Box className="mb-2 flex gap-2 lg:mb-4">
                <Image
                  src={locationIcon}
                  alt="location"
                  className="h-[20px] w-[20px] invert lg:h-[24px] lg:w-[24px]"
                />
                <Typography
                  type="body"
                  color="text-white"
                  className="text-[12px] lg:text-[14px]">
                  {data.address}
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Image
                  src={calendarIcon}
                  alt="location"
                  className="h-[20px] w-[20px] invert lg:h-[24px] lg:w-[24px]"
                />
                <Box className="inline-block">
                  <Typography
                    type="body"
                    color="text-white"
                    className="text-[12px] lg:text-[14px]">
                    {formatDate(data.startDate)}
                  </Typography>
                  {(() => {
                    const startDate = new Date(data.startDate);
                    const endDate = new Date(data.endDate);
                    const isSameDate = startDate.getUTCDate() === endDate.getUTCDate() && 
                                      startDate.getUTCMonth() === endDate.getUTCMonth() && 
                                      startDate.getUTCFullYear() === endDate.getUTCFullYear();
                    
                    return !isSameDate && (
                      <Typography
                        type="body"
                        color="text-white"
                        className="text-[12px] lg:text-[14px]">
                        {formatDate(data.endDate)}
                      </Typography>
                    );
                  })()}
                </Box>
              </Box>
            </Box>

            <Box>
              <Box className="mb-2 flex items-center gap-2 lg:mb-4">
                <Image
                  src={ticketIcon}
                  alt="ticket"
                  className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]"
                />
                <Typography
                  type="body"
                  color="text-white"
                  className="text-[12px] lg:text-[14px]">
                  {data.ticketTypes && data.ticketTypes.length > 0
                    ? `Start from ${formatRupiah(data.ticketTypes[0].price)}`
                    : 'No tickets available'}
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Image
                  src={clockIcon}
                  alt="clock"
                  className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]"
                />
                <Typography
                  type="body"
                  color="text-white"
                  className="text-[12px] lg:text-[14px]">
                  {formatTime(data.startDate)} - {formatTime(data.endDate)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="mt-8 mb-10 text-center lg:hidden">
          <Button onClick={onChooseTicket}>Choose Ticket</Button>
        </Box>

        <Box>
          <Typography
            type="heading"
            size={22}
            color="text-white"
            className="mb-4">
            Event Details
          </Typography>
          <Typography
            type="body"
            color="text-white"
            className="text-[12px] lg:text-[14px]">
            {data.description}
          </Typography>
        </Box>
      </Box>
    </section>
  );
};

export default EventDetail;
