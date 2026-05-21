import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: 'https://us.posthog.com',
  defaults: '2026-01-30',
  capture_exceptions: process.env.NODE_ENV !== 'development',
  debug: false,
  disable_session_recording: process.env.NODE_ENV === 'development',
  opt_out_capturing_by_default: process.env.NODE_ENV === 'development',
});
