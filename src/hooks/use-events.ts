import useSWRInfinite from 'swr/infinite';

const EVENTS_LIMIT = 12;

interface Event {
  id: string | number;
  metaUrl?: string;
  name?: string;
  address?: string;
  eventStatus?: string;
  eventAssets?: { asset?: { url?: string } }[];
  lowestPriceTicketType?: {
    price?: number;
    ticketStartDate?: string;
  };
}

interface EventsPage {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

const getKey = (pageIndex: number, previousPageData: EventsPage | null) => {
  // Reached the end – stop fetching
  if (previousPageData && !previousPageData.hasMore) return null;
  return `/api/events?page=${pageIndex}&limit=${EVENTS_LIMIT}`;
};

export function useEvents() {
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<EventsPage>(getKey, {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    });

  const events = data ? data.flatMap(page => page.events) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd = data ? !data[data.length - 1]?.hasMore : false;
  const isEmpty = !isLoading && events.length === 0;

  const loadMore = () => {
    if (!isValidating && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  return {
    events,
    error,
    isLoading,
    isLoadingMore: !!isLoadingMore,
    isReachingEnd,
    isEmpty,
    loadMore,
  };
}
