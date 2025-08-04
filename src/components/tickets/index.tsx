'use client';
import React, { Fragment } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import { Typography, Container, Box, Button, QRCode } from '@/components';
import Image from 'next/image';
import calendarIcon from '@/assets/icons/calendar-2.svg';
import locationIcon from '@/assets/icons/location.svg';
import dashedDivider from '@/assets/images/dashed-divider.svg';
import { formatDate } from '@/utils/formatter';
import Loading from '../layout/loading';

const Ticket = () => {
  const params = useParams();
  const transactionId = params.id;

  // Initialize state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { data, isLoading } = useSWR(
    transactionId ? `/api/transaction/${transactionId}/tickets` : null
  );

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `/api/transaction/${transactionId}/tickets/export`,
        data,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const url = window.URL.createObjectURL(res.data);
      const eventName = data?.event?.name?.replace(/\s+/g, '_') || 'ticket';
      const eventDate = data?.ticketType?.ticketStartDate
        ? formatDate(data.ticketType.ticketStartDate, 'date')
        : 'download';
      const fileName = `${eventName}-${eventDate}.pdf`;
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to download ticket');
    }
  };

  if (!data || !data.tickets || data.tickets.length === 0)
    return (
      <Container>
        <Box className="text-muted flex h-[200px] items-center justify-center">
          No tickets available
        </Box>
      </Container>
    );

  if (isLoading) return <Loading />;
  return (
    <>
      {loading && <Loading />}
      <Container className="flex justify-center">
        <Box className="mb-20 w-[653px] px-4">
          <Box className="flex justify-between">
            <Typography
              type="heading"
              size={30}
              color="text-white"
              className="mb-6">
              Your Ticket
            </Typography>
            <Box className="block">
              <Button onClick={handleDownload}>Download</Button>
              {error && (
                <Typography
                  type="body"
                  size={10}
                  color="text-red"
                  className="mt-2 text-center">
                  {error}
                </Typography>
              )}
            </Box>
          </Box>

          <Box className="border bg-white p-4 shadow-[4px_4px_0px_0px_#fff] md:p-6">
            <Typography type="heading" size={26} className="block text-center">
              {data.event?.eventOrganizer?.name} | {data.event.name}
            </Typography>

            <Box className="border-gray my-6 rounded-[14px] border-[0.5px] p-[14px]">
              {data.tickets.map((t: any, idx: number) => (
                <Fragment key={idx}>
                  <Box className="border-green flex h-[42px] items-center border-l-[2px]">
                    <Typography
                      type="body"
                      size={18}
                      className="ml-2 font-bold uppercase">
                      {data.ticketType.name} #{idx + 1}
                    </Typography>
                  </Box>

                  <Image
                    src={dashedDivider}
                    alt="Dashed Divider"
                    className="my-4 w-full"
                  />

                  <Box className="grid grid-cols-5 gap-6 pl-0 md:grid-cols-5 md:gap-4">
                    <Box className="col-span-5 flex flex-col items-center justify-center md:col-span-2">
                      <QRCode value={t.ticket_id} size={200} />
                    </Box>

                    <Box className="col-span-5 mt-0 md:col-span-3 md:mt-2 md:mr-8">
                      <Typography
                        type="heading"
                        size={22}
                        className="mb-4 text-center md:text-left">
                        {t.visitor_name}
                      </Typography>

                      <Box className="mb-4 flex items-center gap-4">
                        <Image
                          src={calendarIcon}
                          alt="Calendar"
                          width={24}
                          height={24}
                        />
                        <Typography
                          type="body"
                          size={14}
                          className="font-light">
                          {formatDate(
                            data.ticketType.ticketStartDate,
                            'datetime'
                          )}
                        </Typography>
                      </Box>

                      <Box className="flex items-start gap-4">
                        <Image
                          src={locationIcon}
                          alt="location"
                          width={24}
                          height={24}
                        />
                        <Typography
                          type="body"
                          size={14}
                          className="font-light">
                          {data.event.address}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {idx !== data.tickets.length - 1 && (
                    <hr
                      className={`border-gray border-[0.5px] ${idx === data.tickets.length - 1 ? 'mt-6' : 'my-6'}`}
                    />
                  )}
                </Fragment>
              ))}
            </Box>

            <Button
              className="m-auto mt-6 flex h-6 border-[0.5px] border-black bg-white px-2"
              onClick={() => window.open(data.event.mapLocationUrl, '_blank')}>
              <Typography
                type="body"
                size={12}
                color="text-black"
                className="font-light">
                See Location
              </Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Ticket;
