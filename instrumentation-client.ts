import posthog from 'posthog-js';

// Initialize PostHog on the client side
// This file is loaded automatically by Next.js 15.3+
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    // Use reverse proxy for improved tracking reliability
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Use the latest defaults for PostHog configuration
    defaults: '2025-05-24',
    // Only create person profiles for identified users
    person_profiles: 'identified_only',
    // Enable capturing unhandled exceptions via Error Tracking
    capture_exceptions: true,
    // Turn on debug in development mode
    debug: process.env.NODE_ENV === 'development',
  });
}
