'use client';

import React from 'react';
import posthog from 'posthog-js';

// Note: PostHog is now initialized via instrumentation-client.ts for Next.js 15.3+
// This file provides helper functions for tracking events and identifying users

// Event tracking functions
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
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
export function trackLogin(
  userId: string,
  name?: string,
  email?: string,
  method?: string
): void;
export function trackLogin(userId: string, name?: string, email?: string): void;
export function trackLogin(
  userId: string,
  name?: string,
  email?: string,
  method?: string
): void {
  identifyUser(userId, name, email);
  trackEvent('user_login', { method: method || 'email' });
}

export const trackRegistration = (
  userId: string,
  name?: string,
  email?: string,
  method?: string
) => {
  identifyUser(userId, name, email);
  trackEvent('user_registration', { method: method || 'email' });
};

export const trackTicketPurchase = (
  ticketId: string,
  eventId: string,
  price: number
) => {
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

// Component provider for PostHog (legacy wrapper for compatibility)
// Note: PostHog is now initialized via instrumentation-client.ts
export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default posthog;
