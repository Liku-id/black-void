'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/session/use-auth';
import { Typography, Container } from '@/components';
import { TicketData } from '@/components/tickets/ticket-card/types';
import axios from '@/lib/api/axios-client';
import TicketList from '@/components/tickets/ticket-list';

interface TicketHistoryResponse {
  message: string;
  success: boolean;
  data: {
    ongoing: Array<{
      transaction_id: string;
      event_name: string;
      event_address: string;
      ticket_start_date: string;
      ticket_end_date: string;
    }>;
    expired: Array<{
      transaction_id: string;
      event_name: string;
      event_address: string;
      ticket_start_date: string;
      ticket_end_date: string;
    }>;
  };
}

export default function TicketPage() {
  const { isLoggedIn, loading } = useAuth();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch ticket history from API
  useEffect(() => {
    const fetchTicketHistory = async () => {
      if (!isLoggedIn) return;

      setLoadingTickets(true);
      setError('');

      try {
        const response = await axios.get<TicketHistoryResponse>(
          '/api/tickets/history'
        );

        if (response.data.success) {
          const { ongoing, expired } = response.data.data;

          // Transform API data to TicketData format
          const transformedTickets: TicketData[] = [
            ...ongoing.map((ticket, index) => ({
              id: ticket.transaction_id,
              title: ticket.event_name,
              location: ticket.event_address,
              date: new Date(ticket.ticket_start_date).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
              status: 'ongoing' as const,
              eventId: ticket.transaction_id,
            })),
            ...expired.map((ticket, index) => ({
              id: ticket.transaction_id,
              title: ticket.event_name,
              location: ticket.event_address,
              date: new Date(ticket.ticket_start_date).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
              status: 'expired' as const,
              eventId: ticket.transaction_id,
            })),
          ];

          setTickets(transformedTickets);
        } else {
          setError('Failed to fetch ticket history');
        }
      } catch (error: any) {
        // If API is not available, use mock data for development
        if (error.response?.status === 404 || error.code === 'ENOTFOUND') {
          console.warn('API not available, using mock data for development');
          const mockTickets: TicketData[] = [
            {
              id: '1',
              title: "ENDGAME | WHAT'S YOUR ENDGAME?",
              location: 'Gelora Bung Karno Stadium',
              date: '18 August 2025',
              status: 'ongoing',
              eventId: 'endgame-2025',
            },
            {
              id: '2',
              title: "ENDGAME | WHAT'S YOUR ENDGAME?",
              location: 'Gelora Bung Karno Stadium',
              date: '18 August 2025',
              status: 'ongoing',
              eventId: 'endgame-2025',
            },
            {
              id: '3',
              title: "ENDGAME | WHAT'S YOUR ENDGAME?",
              location: 'Gelora Bung Karno Stadium',
              date: '18 August 2025',
              status: 'expired',
              eventId: 'endgame-2025',
            },
          ];
          setTickets(mockTickets);
          return;
        }

        console.error('Error fetching ticket history:', error);

        // More detailed error handling
        if (error.response) {
          // Server responded with error status
          console.error('Response error:', error.response.data);
          setError(
            `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
          );
        } else if (error.request) {
          // Request was made but no response received
          console.error('Network error:', error.request);
          setError(
            'Network error: Unable to connect to server. Please check your connection.'
          );
        } else {
          // Something else happened
          console.error('Request setup error:', error.message);
          setError(`Request error: ${error.message}`);
        }
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTicketHistory();
  }, [isLoggedIn]);

  if (loading || loadingTickets) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your tickets...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">
          Please login to view your tickets
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ongoingTickets = tickets.filter(
    (ticket) => ticket.status === 'ongoing'
  );
  const expiredTickets = tickets.filter(
    (ticket) => ticket.status === 'expired'
  );

  return (
    <div className="bg-black">
      {/* Header */}
      <Container className="pt-1">
        <Typography
          type="heading"
          size={30}
          color="text-white"
          className="font-bold uppercase"
        >
          YOUR TICKET
        </Typography>
      </Container>
      {/* Main Content */}
      <Container className="py-1">
        {/* ON GOING Section */}
        <TicketList
          tickets={ongoingTickets}
          title="ON GOING"
          className="mb-8"
        />

        {/* EXPIRED Section */}
        <TicketList tickets={expiredTickets} title="EXPIRED" />

        {/* No tickets message */}
        {tickets.length === 0 && (
          <div className="text-center py-16">
            <Typography
              type="heading"
              size={24}
              color="text-white"
              className="font-bold"
            >
              You don't have any tickets yet
            </Typography>
          </div>
        )}
      </Container>
    </div>
  );
}
