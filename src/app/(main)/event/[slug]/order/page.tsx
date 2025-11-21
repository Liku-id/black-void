'use client';
import axios from 'axios';
import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCountdown } from '@/utils/timer';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { contactDetailAtom, orderBookingAtom } from '@/store/atoms/order';
import { useAuth } from '@/lib/session/use-auth';
import { Box, Container } from '@/components';
import Loading from '@/components/layout/loading';
import ContactDetailSection from '@/components/event/contact-detail';
import VisitorDetailSection from '@/components/event/visitor-detail';
import SummarySection from '@/components/event/summary-section';
import SummarySectionMobile from '@/components/event/summary-section/mobile';
import useStickyObserver from '@/utils/sticky-observer';
import EventPageSkeleton from '@/components/event/skeletons';
import { getErrorMessage } from '@/lib/api/error-handler';
import { calculatePriceWithPartnership } from '@/utils/formatter';

// Contact form data type
interface FormDataContact {
  fullName: string;
  phoneNumber: string;
  email: string;
  countryCode: string;
}

interface FormDataVisitor {
  visitors: {
    [key: string]: any;
  }[];
}

const OrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const { isLoggedIn, userData } = useAuth();

  // Initial State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [order] = useAtom(orderBookingAtom);
  const [contactDetail, setContactDetail] = useAtom(contactDetailAtom);
  const [initialSeconds, setInitialSeconds] = useState(900);
  const [secondsLeft, resetCountdown] = useCountdown(initialSeconds);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisitorDetailChecked, setIsVisitorDetailChecked] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    id: string;
    name: string;
    paymentMethodFee: number;
  } | null>(null);

  // Get partner_code from query params if available
  const partnerCode = searchParams.get('partner_code');
  const eventApiUrl = slug
    ? partnerCode
      ? `/api/events/${slug}?partner_code=${partnerCode}`
      : `/api/events/${slug}`
    : null;

  // Fetch Data
  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
  } = useSWR(eventApiUrl);

  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useSWR(order.orderId ? `/api/order/${order.orderId}` : null);

  const splitPhoneNumber = (phone: string) => {
    const match = phone.match(/^(\+\d{1,2})(\d{9,15})$/);

    return match
      ? { countryCode: match[1], phoneNumber: match[2] }
      : { countryCode: '+62', phoneNumber: phone };
  };

  const contactMethods = useForm<FormDataContact>({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      countryCode: '+62',
    },
  });

  const onContactSubmit = (data: FormDataContact) => {
    if (
      isVisitorDetailChecked &&
      orderData?.ticketType?.additional_forms?.length > 0
    ) {
      // Copy nama ke field pertama additional_forms (yang pasti nama)
      const firstField = orderData.ticketType.additional_forms[0];
      visitorMethods.setValue(`visitors.0.${firstField.field}`, data.fullName);
      visitorMethods.trigger(`visitors.0.${firstField.field}`);
    }
    setContactDetail((prev) => ({
      ...prev,
      full_name: data.fullName,
      country_code: data.countryCode,
      phone_number: data.phoneNumber,
      email: data.email,
    }));
    scrollToVisitorDetail();
  };

  const visitorMethods = useForm<FormDataVisitor>({
    mode: 'onChange',
    defaultValues: {
      visitors: orderData
        ? Array.from({ length: orderData.quantity }, () => {
            const visitor: any = {};
            if (orderData.ticketType?.additional_forms) {
              orderData.ticketType.additional_forms.forEach((form: any) => {
                if (form.type === 'CHECKBOX') {
                  visitor[form.field] = [];
                } else {
                  visitor[form.field] = '';
                }
              });
            }
            if (!orderData.ticketType?.additional_forms?.length) {
              visitor.fullName = '';
            }
            return visitor;
          })
        : [],
    },
  });

  const visitorDetailRef = useRef<HTMLDivElement>(null);
  const scrollToVisitorDetail = () => {
    visitorDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sticky logic
  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isSticky, absoluteTop, isReady } = useStickyObserver(
    stickyRef as React.RefObject<HTMLDivElement>,
    sentinelRef as React.RefObject<HTMLDivElement>,
    eventData && orderData ? 112 : 0
  );

  // Calculate totalPrice to determine if payment method is required
  const totalPrice =
    orderData?.tickets?.reduce((sum: number, t: any) => {
      const basePrice = Number(t.price);
      const finalPrice = calculatePriceWithPartnership(
        basePrice,
        t.partnership_info
      );
      return sum + t.count * finalPrice;
    }, 0) || 0;

  const isDisabled =
    !contactMethods.formState.isValid ||
    !visitorMethods.formState.isValid ||
    (totalPrice > 0 && !selectedPayment);

  const handleContinue = async () => {
    const isValid = await visitorMethods.trigger();
    if (!isValid) {
      const visitorSection = document.querySelector('[data-visitor-section]');
      if (visitorSection) {
        visitorSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    try {
      setLoading(true);
      const visitorData = visitorMethods?.getValues();
      const contactData = contactMethods.getValues();

      const payload = {
        orderId: order.orderId,
        paymentMethodId: selectedPayment?.id,
        attendee: visitorData?.visitors?.map((v) => {
          const attendeeData: any[] = [];
          // Process each additional form field
          if (orderData?.ticketType?.additional_forms) {
            orderData.ticketType.additional_forms.forEach((form: any) => {
              const fieldValue = (v as any)[form.field];
              if (
                fieldValue !== undefined &&
                fieldValue !== null &&
                fieldValue !== ''
              ) {
                let value = fieldValue;
                if (!Array.isArray(value)) {
                  value = [String(value)];
                }
                attendeeData.push({
                  additionalFormId: form.id,
                  value: value,
                });
              }
            });
          }

          return {
            attendeeData,
          };
        }),

        contactDetails: {
          name: contactData.fullName,
          email: contactData.email,
          phone: contactData.countryCode + contactData.phoneNumber,
        },
      };

      const { data: response } = await axios.post(
        '/api/transaction/create',
        payload
      );

      if (response.success) {
        router.push(`/transaction/${response.id}`);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.error || 'Failed to create transaction');
    }
  };

  useEffect(() => {
    if (orderData && orderData.expiredAt) {
      const expiredAt = new Date(orderData.expiredAt);
      const now = new Date();
      setInitialSeconds(
        Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / 1000))
      );
      resetCountdown();
    }
  }, [orderData, resetCountdown]);

  // Redirect
  useEffect(() => {
    if (
      !eventLoading &&
      !orderLoading &&
      (secondsLeft === 0 || !order.orderId || !eventData)
    ) {
      router.replace(`/event/${slug}`);
    }
  }, [
    secondsLeft,
    order.orderId,
    eventData,
    eventLoading,
    orderLoading,
    router,
    slug,
  ]);

  useEffect(() => {
    if (isLoggedIn && userData && !isInitialized) {
      contactMethods.setValue('fullName', userData.fullName || '');
      contactMethods.setValue(
        'phoneNumber',
        splitPhoneNumber(userData.phoneNumber || '').phoneNumber
      );
      contactMethods.setValue('email', userData.email || '');
      contactMethods.setValue(
        'countryCode',
        splitPhoneNumber(userData.phoneNumber || '').countryCode
      );
      setIsInitialized(true);
    } else if (contactDetail.full_name && !isInitialized) {
      contactMethods.setValue('fullName', contactDetail.full_name || '');
      contactMethods.setValue(
        'phoneNumber',
        splitPhoneNumber(contactDetail.phone_number || '').phoneNumber
      );
      contactMethods.setValue('email', contactDetail.email || '');
      contactMethods.setValue(
        'countryCode',
        contactDetail.country_code || '+62'
      );
      setIsInitialized(true);
    }
  }, [
    isLoggedIn,
    userData,
    contactDetail,
    contactMethods.setValue,
    isInitialized,
  ]);

  // Auto-select "Free" payment method when totalPrice = 0
  useEffect(() => {
    if (orderData?.tickets) {
      const totalPrice = orderData.tickets.reduce((sum: number, t: any) => {
        const basePrice = Number(t.price);
        const finalPrice = calculatePriceWithPartnership(
          basePrice,
          t.partnership_info
        );
        return sum + t.count * finalPrice;
      }, 0);

      if (totalPrice === 0 && !selectedPayment) {
        const freePaymentMethod = eventData?.paymentMethods?.find(
          (method: any) =>
            method.name.toLowerCase().includes('free') || method.type === 'FREE'
        );

        if (freePaymentMethod) {
          setSelectedPayment({
            id: freePaymentMethod.id,
            name: freePaymentMethod.name,
            paymentMethodFee: 0,
          });
        }
      }
    }
  }, [orderData?.tickets, eventData?.paymentMethods, selectedPayment]);

  if (eventLoading || orderLoading || !order.orderId) {
    return <EventPageSkeleton />;
  }

  if (eventError || orderError) {
    return <Box className="text-red-500">Failed to load order data</Box>;
  }

  return (
    <>
      {loading && <Loading />}
      <Container className="relative mx-auto flex max-w-[1140px] mt-8 lg:mt-14">
        <Box className="flex-1">
          <Container className="flex gap-16 px-4">
            <Box className="w-full lg:w-5/10 lg:max-w-5/10 xl:w-6/10 xl:max-w-6/10">
              <ContactDetailSection
                eventData={eventData}
                secondsLeft={secondsLeft}
                methods={contactMethods}
                onBack={() => router.back()}
                onSubmit={onContactSubmit}
              />
              <Box className="relative mt-8 mb-25 lg:mb-0">
                <Box className="absolute top-[-120px]" ref={visitorDetailRef} />
                <VisitorDetailSection
                  isVisitorDetailChecked={isVisitorDetailChecked}
                  setIsVisitorDetailChecked={setIsVisitorDetailChecked}
                  visitorMethods={visitorMethods}
                  contactMethods={contactMethods}
                  tickets={orderData.tickets}
                  ticketType={orderData.ticketType}
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
            ' z-1 hidden lg:block'
          }
          style={!isSticky && isReady ? { top: absoluteTop } : {}}
        >
          <SummarySection
            eventData={eventData}
            tickets={orderData.tickets.map((t: any) => ({
              id: t.id,
              name: t.name,
              price: String(t.price),
              count: t.count,
              partnership_info: t.partnership_info || null,
            }))}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onContinue={handleContinue}
            disabled={isDisabled}
            error={error}
          />
        </Box>
        {/* MOBILE: Sticky summary section (right column) */}
        <Box className="fixed bottom-0 left-0 z-50 block w-full lg:hidden">
          <SummarySectionMobile
            eventData={eventData}
            tickets={orderData.tickets.map((t: any) => ({
              id: t.id,
              name: t.name,
              price: String(t.price),
              count: t.count,
              partnership_info: t.partnership_info || null,
            }))}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onContinue={handleContinue}
            disabled={isDisabled}
            error={error}
          />
        </Box>
      </Container>
      <Box ref={sentinelRef} className="-mt-[80px]" />
    </>
  );
};

export default OrderPage;
