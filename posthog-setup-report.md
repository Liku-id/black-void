<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Wukong ticketing platform. The integration covers the full user lifecycle — from registration and login, through the ticket purchase funnel, to event-day ticket redemption by partner staff.

**Infrastructure added:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 16's `instrumentation-client` pattern (no provider required). Captures unhandled exceptions automatically via `capture_exceptions: true`. Routes all events through a `/ingest` reverse proxy added to `next.config.ts`.
- `src/lib/posthog-server.ts` — Singleton server-side PostHog client (`posthog-node`) used in API routes.
- `.env.local` — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set.
- `next.config.ts` — Reverse proxy rewrites added for `/ingest/static/:path*` and `/ingest/:path*`, plus `skipTrailingSlashRedirect: true`.

**User identification:** On successful login, `posthog.identify()` is called with the user's email and role as the distinct ID and properties, correlating all subsequent events to the authenticated user.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the platform | `src/components/auth/login/form.tsx` |
| `user_registered` | User completes and submits the registration form | `src/components/auth/register/register-form.tsx` |
| `ticket_added_to_order` | User selects a ticket for purchase (count goes from 0 to 1) | `src/components/event/ticket-card/index.tsx` |
| `checkout_continued` | User clicks Continue on the order summary section | `src/components/event/summary-section/index.tsx` |
| `order_created` | Server-side: An order is successfully created | `src/app/api/order/create/route.ts` |
| `transaction_created` | Server-side: A payment transaction is successfully created | `src/app/api/transaction/create/route.ts` |
| `payment_completed` | User's payment is confirmed as paid | `src/components/payment/transaction-status/index.tsx` |
| `payment_failed` | User's payment has failed | `src/components/payment/transaction-status/index.tsx` |
| `ticket_redeemed` | Partner staff successfully redeems a ticket via QR scan | `src/app/(partner)/ticket/scanner/page.tsx` |
| `ticket_scan_failed` | Ticket scan fails (invalid, already redeemed, or error) | `src/app/(partner)/ticket/scanner/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/37185/dashboard/1442365
- **Ticket Purchase Funnel** (ticket selection → checkout → order → payment): https://us.posthog.com/project/37185/insights/VoUekX0A
- **Daily Logins & New Registrations** (user_logged_in DAU + user_registered trend): https://us.posthog.com/project/37185/insights/BfDYVqkO
- **Payment Success vs Failure** (payment_completed vs payment_failed over time): https://us.posthog.com/project/37185/insights/iLnCf5Yt
- **Ticket Redemption Success Rate** (ticket_redeemed vs ticket_scan_failed): https://us.posthog.com/project/37185/insights/FxH39ML8
- **Registration to Login Funnel** (user_registered → user_logged_in conversion): https://us.posthog.com/project/37185/insights/SORUhHdJ

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
