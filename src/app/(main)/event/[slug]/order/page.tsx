'use client';
import useSWR from 'swr';
import React, { useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCountdown } from '@/utils/timer';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { orderAtom } from '@/atoms/order';
import { fetchAuthAtom, userDataAtom } from '@/store';
import { Box, Container } from '@/components';
import ContactDetailSection from '@/components/event/contact-detail';
import VisitorDetailSection from '@/components/event/visitor-detail';
import SummarySection from '@/components/event/summary-section';
import SummarySectionMobile from '@/components/event/summary-section/mobile';
import useStickyObserver from '@/utils/sticky-observer';
// import { getOrderId } from '@/utils/local-storage';

// Contact form data type
interface FormDataContact {
  fullName: string;
  phoneNumber: string;
  email: string;
  countryCode: string;
}

interface FormDataVisitor {
  visitors: {
    fullName: string;
    // phoneNumber: string;
    // email: string;
    // countryCode: string;
    // idType: string;
  }[];
}

const OrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  // Fetch Data
  const { data, isLoading, error } = useSWR(
    slug ? `/api/events/${slug}` : null
  );

  const mockOrder = {
    tickets: [
      { id: 'tkt-1', name: 'VIP', price: '500000', count: 2 },
      { id: 'tkt-2', name: 'Reguler', price: '150000', count: 1 },
    ],
    expiredAt: '2024-07-01T12:00:00Z',
  };

  // Initial State
  const [order, setOrder] = useAtom(orderAtom);
  const [isLoggedIn] = useAtom(fetchAuthAtom);
  const [userData] = useAtom(userDataAtom);
  // Calculate secondsLeft from expiredAt
  const expiredAtStr = mockOrder.expiredAt;
  const expiredAt = expiredAtStr ? new Date(expiredAtStr) : null;
  const now = new Date();
  const initialSeconds = expiredAt
    ? Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / 1000))
    : 900;
  const [secondsLeft] = useCountdown(initialSeconds);

  // Helper function to split phone number using regex
  const splitPhoneNumber = (phone: string) => {
    const match = phone.match(/^(\+\d+)(.+)$/);
    return match
      ? { countryCode: match[1], phoneNumber: match[2] }
      : { countryCode: '+62', phoneNumber: phone };
  };

  // Autofill logic in parent
  const contactMethods = useForm<FormDataContact>({
    mode: 'onSubmit', // Changed from 'onChange' to 'onSubmit' to prevent showing errors immediately
    defaultValues: {
      fullName: isLoggedIn ? userData.fullName : order.full_name || '',
      phoneNumber: isLoggedIn
        ? splitPhoneNumber(userData.phoneNumber || '').phoneNumber
        : order.phone_number || '',
      email: isLoggedIn ? userData.email : order.email || '',
      countryCode: isLoggedIn
        ? splitPhoneNumber(userData.phoneNumber || '').countryCode
        : order.country_code || '+62',
    },
  });

  const onContactSubmit = (data: FormDataContact) => {
    console.log(data);
    setOrder(prev => ({
      ...prev,
      full_name: data.fullName,
      country_code: data.countryCode,
      phone_number: data.phoneNumber,
      email: data.email,
    }));
    scrollToVisitorDetail();
  };

  const visitorMethods = useForm<FormDataVisitor>({
    mode: 'onSubmit', // Changed to 'onSubmit' to prevent showing errors immediately
    defaultValues: {
      visitors: mockOrder.tickets.map(() => ({
        fullName: '',
        // phoneNumber: '',
        // email: '',
        // countryCode: '+62',
        // idType: '',
      })),
    },
  });

  const visitorDetailRef = useRef<HTMLDivElement>(null);
  const scrollToVisitorDetail = () => {
    visitorDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sticky logic
  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isSticky, absoluteTop } = useStickyObserver(
    stickyRef as React.RefObject<HTMLDivElement>,
    sentinelRef as React.RefObject<HTMLDivElement>,
    112
  );

  // Check for orderId in localStorage on mount
  // useEffect(() => {
  //   const orderId = getOrderId();
  //   if (!orderId) {
  //     router.replace(`/event/${params.slug}`);
  //   }
  // }, [router, params.slug]);

  // Remove automatic trigger to prevent showing errors on first load
  // React.useEffect(() => {
  //   contactMethods.trigger();
  // }, []);

  if (isLoading) {
    return <div className="min-h-[600px] w-full animate-pulse bg-gray-100" />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load order data</div>;
  }

  return (
    <>
      <Container className="relative mx-auto flex max-w-[1140px]">
        <Box className="flex-1">
          <Container className="flex gap-16 px-4">
            <Box className="w-full lg:w-5/10 lg:max-w-5/10 xl:w-6/10 xl:max-w-6/10">
              <ContactDetailSection
                eventData={data}
                secondsLeft={secondsLeft}
                methods={contactMethods}
                onBack={() => router.back()}
                onSubmit={onContactSubmit}
              />
              <Box className="relative mt-8 mb-25 lg:mb-0">
                <Box className="absolute top-[-120px]" ref={visitorDetailRef} />
                <VisitorDetailSection
                  methods={visitorMethods}
                  order={order}
                  tickets={mockOrder.tickets}
                />
              </Box>
            </Box>
            <Box className="hidden w-5/10 max-w-5/10 lg:block xl:w-4/10 xl:max-w-4/10" />
          </Container>
        </Box>

        {/* DESKTOP: Sticky summary section (right column) */}
        <Box
          ref={stickyRef}
          className={
            (isSticky
              ? // Sticky mode
                'sticky top-30 right-8 -ml-[455px] w-[455px] self-start xl:right-0 xl:w-[455px] 2xl:right-[708px]'
              : // Absolute mode
                'absolute right-8 w-[455px] xl:right-0 xl:w-[455px]') +
            ' hidden lg:block'
          }
          style={!isSticky ? { top: absoluteTop } : {}}>
          <SummarySection
            eventData={data}
            tickets={mockOrder.tickets}
            isContactValid={contactMethods.formState.isValid}
            isVisitorValid={visitorMethods.formState.isValid}
            visitorMethods={visitorMethods}
          />
        </Box>
        {/* MOBILE: Sticky summary section (right column) */}
        <Box className="fixed bottom-0 left-0 z-50 block w-full lg:hidden">
          <SummarySectionMobile
            eventData={data}
            tickets={mockOrder.tickets}
            isContactValid={contactMethods.formState.isValid}
            isVisitorValid={visitorMethods.formState.isValid}
            visitorMethods={visitorMethods}
          />
        </Box>
      </Container>
      <Box ref={sentinelRef} className="-mt-[80px]" />
    </>
  );
};

export default OrderPage;
