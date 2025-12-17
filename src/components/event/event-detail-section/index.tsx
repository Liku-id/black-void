'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from '@/components/common/carousel';
import { Box, Button, Slider, Typography } from '@/components';
import { EventData } from './event';
import Image from 'next/image';
import locationIcon from '@/assets/icons/location.svg';
import calendarIcon from '@/assets/icons/calendar.svg';
import ticketIcon from '@/assets/icons/ticket.svg';
import clockIcon from '@/assets/icons/clock.svg';
import {
  formatRupiah,
  formatTime,
  formatStrToHTML,
  formatDate,
  calculatePriceWithPartnership,
} from '@/utils/formatter';

interface EventDetailProps {
  data: EventData;
  onChooseTicket?: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ data, onChooseTicket }) => {
  const items = (data && data.eventAssets) || [];
  const hasAssets = items.length > 0;
  const descriptionWrapperRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);

  useEffect(() => {
    if (!descriptionWrapperRef.current) {
      setShouldShowToggle(false);
      return;
    }

    const el = descriptionWrapperRef.current;
    const shouldTruncate = el.scrollHeight > 132;
    setShouldShowToggle(shouldTruncate);
  }, [data.description]);

  const startDateWIB = formatDate(data.startDate, 'date');
  const endDateWIB = formatDate(data.endDate, 'date');
  const dateText =
    startDateWIB === endDateWIB
      ? formatDate(data.startDate, 'full')
      : `${formatDate(data.startDate, 'full')} - ${formatDate(data.endDate, 'full')}`;

  return (
    <section>
      <Box className="pb-[100px] lg:grid lg:grid-cols-[55fr_45fr] lg:gap-2">
        <Box className="w-full">
          <Box className="block md:hidden">
            {hasAssets ? (
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
            ) : (
              <Box className="flex items-center justify-center rounded-lg px-4 py-16">
                <Typography type="body" size={14} color="text-white">
                  No images available
                </Typography>
              </Box>
            )}
          </Box>
          <Box className="mb-8 hidden md:mb-0 md:block">
            {hasAssets ? (
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
            ) : (
              <Box className="flex items-center justify-center rounded-lg px-4 py-16">
                <Typography type="body" size={14} color='text-white'>
                  No images available
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="px-4 lg:px-0 mt-8 lg:mt-0">
          <Box className="mb-6">
            <Typography
              as="h1"
              type="heading"
              color="text-white"
              className="mb-2 text-[26px] lg:text-[30px]">
              {data.name}
            </Typography>
            <Box className="grid gap-2 lg:grid-cols-2 lg:gap-[18px]">
              <Box className="flex items-start gap-2">
                <Image
                  src={locationIcon}
                  alt="location"
                  className="h-[20px] w-[20px] invert lg:h-[24px] lg:w-[24px]"
                />
                <Typography
                  type="body"
                  color="text-white"
                  className="max-w-full text-[12px] lg:text-[14px]">
                  {data.address}
                </Typography>
              </Box>

              <Box className="flex items-start gap-2">
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
                    ? (() => {
                        const firstTicket = data.ticketTypes[0];
                        const basePrice = Number(firstTicket.price);
                        const finalPrice = calculatePriceWithPartnership(
                          basePrice,
                          firstTicket.partnership_info
                        );
                        return `Start from ${formatRupiah(finalPrice)}`;
                      })()
                    : 'No tickets available'}
                </Typography>
              </Box>

              <Box className="flex items-start gap-2">
                <Image
                  src={calendarIcon}
                  alt="calendar"
                  className="h-[20px] w-[20px] invert lg:h-[24px] lg:w-[24px]"
                />
                <Typography
                  type="body"
                  color="text-white"
                  className="max-w-full text-[12px] lg:text-[14px]">
                  {dateText}
                </Typography>
              </Box>

              <Box className="flex items-start gap-2">
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
          <Box className="mt-8 mb-10 text-center lg:hidden">
            <Button onClick={onChooseTicket}>Choose Ticket</Button>
          </Box>

          <Typography
            as="h2"
            type="heading"
            size={22}
            color="text-white"
            className="mb-4">
            Event Details
          </Typography>
          <Box
            ref={descriptionWrapperRef}
            className={`text-white ${isExpanded ? '' : 'lg:max-h-[132px] lg:overflow-hidden'}`}>
            <Typography
              type="body"
              color="text-white"
              className="text-[12px] lg:text-[14px]"
              dangerouslySetInnerHTML={{
                __html: formatStrToHTML(data.description),
              }}
            />
          </Box>
          {shouldShowToggle && (
            <Typography
              as="button"
              type="body"
              color="text-white"
              className="mt-3 hidden text-left text-[12px] underline lg:block"
              onClick={() => setIsExpanded(prev => !prev)}>
              {isExpanded ? 'Show Less' : 'See Detail'}
            </Typography>
          )}
        </Box>
      </Box>
    </section>
  );
};

export default EventDetail;
