import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * Get the PostHog server-side client
 * This is used for server-side event tracking in API routes and server components
 */
export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // Set flushAt to 1 and flushInterval to 0 to send events immediately
      // This is important for server-side functions that can be short-lived
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

/**
 * Shutdown the PostHog client
 * Call this after sending events to ensure all events are flushed
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
