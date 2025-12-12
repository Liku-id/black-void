'use client';

import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';

// Initialize PostHog
export const initPostHog = () => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  if (typeof window !== 'undefined') {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
      });
    }
  }
};

// Hook untuk menggunakan PostHog
export const usePostHog = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkPostHog = () => {
      if (typeof window !== 'undefined' && (window as any).posthog) {
        setIsLoaded(true);
      } else {
        setTimeout(checkPostHog, 100);
      }
    };
    checkPostHog();
  }, []);

  return {
    posthog: typeof window !== 'undefined' ? (window as any).posthog : null,
    isLoaded,
  };
};

// Event tracking functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    posthog.capture(eventName, properties);
  }
};

// User identification - hanya nama dan email
export const identifyUser = (userId: string, name?: string, email?: string) => {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    const properties: Record<string, any> = {};
    if (name) properties.name = name;
    if (email) properties.email = email;
    
    posthog.identify(userId, properties);
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    posthog.setPersonProperties(properties);
  }
};


// Common events
export function trackLogin(userId: string, name?: string, email?: string, method?: string): void;
export function trackLogin(userId: string, name?: string, email?: string): void;
export function trackLogin(userId: string, name?: string, email?: string, method?: string): void {
  identifyUser(userId, name, email);
  trackEvent('user_login', { method: method || 'email' });
}

export const trackRegistration = (userId: string, name?: string, email?: string, method?: string) => {
  identifyUser(userId, name, email);
  trackEvent('user_registration', { method: method || 'email' });
};

export const trackTicketPurchase = (ticketId: string, eventId: string, price: number) => {
  trackEvent('ticket_purchase', {
    ticket_id: ticketId,
    event_id: eventId,
    price,
  });
};

export const trackEventView = (eventId: string, eventName: string) => {
  trackEvent('event_view', {
    event_id: eventId,
    event_name: eventName,
  });
};

// Component untuk initialize PostHog
export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize PostHog
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
};

export default posthog;
