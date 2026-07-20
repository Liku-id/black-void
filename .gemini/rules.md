# Black Void (Wukong) — AI Coding Rules

> Consumer-facing ticketing web app. This is a **BFF (Backend-for-Frontend)** — it has **no local database**. All domain data lives in an external REST API; a secondary GraphQL API (EKUID) is used only for event-organizer registration flows.

---

## 1. Project Overview

| Area | Stack |
|---|---|
| **Framework** | Next.js **16.0.10**, App Router, TypeScript (`strict: true`) |
| **React** | **19.2.1** — install deps with `npm install --legacy-peer-deps` |
| **Node** | **20+** (see `.nvmrc`) |
| **Styling** | Tailwind CSS **v4**, `clsx` + `tailwind-merge` (`cn()` in `src/utils/utils.ts`), CVA for variants |
| **UI library** | **Custom components** in `src/components/common/` — **not shadcn/ui** (despite README mention) |
| **i18n** | `next-intl` **4.x** — locales `en` \| `id`, always prefixed (`/en/...`, `/id/...`) |
| **Database** | **None in this repo.** Data fetched from external REST API via `INTERNAL_API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` |
| **Secondary API** | Apollo Client → GraphQL at `API_EKUID_URL` (provinces, industry categories, event-organizer registration) |
| **Auth** | **Custom cookie-based JWT** — `access_token`, `refresh_token`, `user_role` httpOnly cookies; backend endpoints at `/v1/auth/*` |
| **Client state** | **Jotai** atoms in `src/store/` |
| **Client data fetching** | **SWR** (global fetcher in `src/lib/api/swr-provider/`) |
| **Forms** | **react-hook-form** + custom validators in `src/utils/form-validation/` |
| **HTTP clients** | `axios-client` (browser → `/api/*`), `axios-server` (Route Handlers → backend `/v1/*`) |
| **3D / visuals** | Three.js (`src/components/visuals/three-background/`) |
| **Testing** | Jest + Testing Library; co-located `*.test.ts(x)` files |
| **Build** | `output: 'standalone'` in `next.config.ts` |

### Related repositories

| Repo | Role |
|---|---|
| **black-void** (this repo) | Consumer-facing Wukong ticketing site (BFF + UI) |
| **black-hole** | Separate admin/organizer dashboard — do not merge patterns blindly; it may use different auth/data patterns |

### Auth roles (from `src/proxy.ts`)

| Role | Cookie value | Typical redirect |
|---|---|---|
| Buyer | `buyer` | Public event pages |
| Ground staff | `ground_staff` | `/ticket/scanner` |
| Event organizer PIC | `event_organizer_pic` | `/ticket/scanner` |
| Admin | `admin` | Staff routes allowed |

---

## 2. Project Structure

```
black-void/
├── next.config.ts          # next-intl plugin, security headers, redirects, standalone output
├── config/                 # jest, eslint, prettier configs (not app config)
├── src/
│   ├── proxy.ts            # Next.js 16 proxy (auth guards + next-intl + Authorization injection)
│   ├── app/
│   │   ├── layout.tsx      # Root layout: fonts, GTM, NextIntlClientProvider, SWRProvider
│   │   ├── [locale]/       # All localized routes (en | id)
│   │   │   ├── (main)/     # Public buyer pages: home, events, tickets, legal, about-us
│   │   │   ├── (auth)/     # Login, register, OTP, forgot/reset password
│   │   │   ├── (payment)/  # Checkout, payment success, transaction tickets
│   │   │   └── (partner)/  # Staff: ticket auth, QR scanner
│   │   ├── api/            # BFF Route Handlers — proxy to backend REST / EKUID GraphQL
│   │   ├── coming-soon/    # Standalone page (no locale prefix)
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── common/         # Reusable UI primitives (Button, Modal, TextField, …)
│   │   ├── layout/         # Header, footer, loading overlay, auth layout
│   │   ├── auth/           # Login, register, OTP, password reset forms
│   │   ├── event/          # Event detail, ticket selection, order flow
│   │   ├── payment/        # Transaction confirmation, status, VA/QRIS
│   │   ├── home/           # Homepage sections
│   │   ├── tickets/        # My tickets list & detail
│   │   ├── scanner/        # QR scanner for staff
│   │   ├── about-us/       # About page sections
│   │   ├── event-funding/  # Crowdfunding / become-creator form
│   │   ├── legal/          # Privacy, T&C, cookie policy content
│   │   ├── tracking/       # UTM / analytics capture
│   │   ├── visuals/        # Three.js background
│   │   └── index.ts        # Barrel export for common + layout primitives
│   ├── lib/
│   │   ├── api/
│   │   │   ├── axios-client/   # Browser axios → /api/* (auto refresh on 401)
│   │   │   ├── axios-server/   # Server axios → backend /v1/*
│   │   │   ├── apollo-client/  # GraphQL client for EKUID
│   │   │   ├── error-handler/  # handleErrorAPI, getErrorMessage
│   │   │   ├── swr-provider/   # Global SWR fetcher
│   │   │   └── queries/        # GraphQL query/mutation strings
│   │   ├── i18n/               # request.ts, navigation.ts, messages/{en,id}.json
│   │   ├── session/            # setAuthCookies, useAuth hook
│   │   ├── browser-storage/    # sessionStorage/localStorage helpers
│   │   └── utils/              # encryptUtils (preview_token)
│   ├── store/              # Jotai atoms (auth, order, register form)
│   ├── hooks/              # SWR-based hooks (useEvents, useProvinces, …)
│   ├── services/           # Client service layer calling /api/ekuid/*
│   ├── utils/              # formatter, form-validation, debounce, cn()
│   ├── config/             # SEO metadata (seo.ts)
│   ├── assets/             # Icons, images, logos (SVG/WebP)
│   └── styles/             # globals.css, animations.css
```

### Route groups

| Group | Purpose | Example paths |
|---|---|---|
| `(main)` | Buyer-facing public pages | `/`, `/event/[slug]`, `/tickets`, `/about-us` |
| `(auth)` | Authentication flows | `/login`, `/register`, `/forgot-password` |
| `(payment)` | Post-order payment | `/checkout-payment/[id]`, `/payment-success/[id]` |
| `(partner)` | Staff / scanner | `/ticket/auth`, `/ticket/scanner` |

Parentheses in folder names are **route groups** — they do not appear in the URL.

### Path alias

`@/*` → `./src/*` (configured in `tsconfig.json`)

---

## 3. Rendering Conventions

### Default: Server Components

Use Server Components when the page/section:

- Fetches translations via `getTranslations()` / `getLocale()` from `next-intl/server`
- Exports static `metadata` or `generateMetadata`
- Has no browser APIs, hooks, or client interactivity
- Composes mostly static/marketing content

**Examples:** `src/app/[locale]/(main)/page.tsx`, `src/app/[locale]/(main)/about-us/page.tsx`

### `'use client'` — required when:

- Using React hooks (`useState`, `useEffect`, `useMemo`, …)
- Using **SWR** / `useSWR` / `useSWRInfinite`
- Using **Jotai** (`useAtom`)
- Using **react-hook-form**
- Using browser APIs (`window`, `sessionStorage`, geolocation, camera/QR)
- Handling user events (onClick, onChange)
- Using `next/navigation` hooks that require client context (`useSearchParams` in interactive trees)

**Examples:** `src/app/[locale]/(main)/event/[slug]/page.tsx`, all forms in `src/components/auth/`

### Hybrid pattern (preferred for new pages)

1. **`page.tsx`** — thin Server Component (metadata + `dynamic()` import)
2. **Feature component** — `'use client'` with SWR/interactivity

```tsx
// page.tsx (Server Component)
import dynamic from 'next/dynamic';
const MyFeature = dynamic(() => import('@/components/my-feature'));

export default function Page() {
  return <MyFeature />;
}
```

### Navigation in localized routes

- **Do** use `@/lib/i18n/navigation` → `Link`, `useRouter`, `usePathname`, `redirect`
- **Don't** use `next/link` or `next/navigation` router directly for locale-aware navigation (except `useSearchParams`, `useParams` where needed)

### Dynamic imports

Use `next/dynamic` to code-split heavy client sections (event lists, payment confirmation, ticket pages).

### Suspense

Wrap client components that use `useSearchParams` in `<Suspense>` (see `TrackingProvider`, payment layout header).

### Next.js 16 async APIs (required)

In Route Handlers, layouts, and pages, these are **async** — always `await`:

```ts
const { slug } = await params;           // params is Promise<{ … }>
const { locale } = await params;         // include locale in [locale] segments
const cookieStore = await cookies();
const headersList = await headers();
```

Sync access to `params`, `cookies()`, or `headers()` will fail at build/runtime in Next.js 16.

### i18n in Server vs Client Components

| Context | Import | Function |
|---|---|---|
| Server Component / `generateMetadata` | `next-intl/server` | `getTranslations()`, `getLocale()` |
| Client Component (`'use client'`) | `next-intl` | `useTranslations()` |

Never use `useTranslations()` in a Server Component. If a page needs client-side translation hooks, split into a `'use client'` child component (see hybrid pattern above).

---

## 4. Naming Conventions

| Kind | Convention | Example |
|---|---|---|
| React components | **PascalCase** | `EventDetailSection`, `LoginForm` |
| Component folders | **kebab-case** with `index.tsx` | `components/event/summary-section/index.tsx` |
| Route segment folders | **kebab-case** | `checkout-payment`, `choose-verification`, `event-funding` |
| Route groups | **parentheses, lowercase** | `(main)`, `(auth)`, `(payment)`, `(partner)` |
| Hooks | **camelCase**, `use` prefix | `useAuth`, `useEvents`, `useProvinces` |
| Jotai atoms | **camelCase** + `Atom` suffix | `authAtom`, `orderBookingAtom` |
| Utility functions | **camelCase** | `getErrorMessage`, `calculateTicketPrice` |
| API route folders | **kebab-case**, mirror REST paths | `api/auth/refresh-token`, `api/events/[slug]` |
| Type/interface files | **kebab-case** or co-located | `event.ts`, `types.ts`, `typography.types.ts` |
| Test files | co-located **`*.test.ts(x)`** | `form.test.tsx` next to `form.tsx` |
| Static assets | **kebab-case** | `eye-open.svg`, `creator-main.webp` |
| i18n keys | **snake_case** in JSON | `metadata.home.title`, `faq.buy_ticket_q` |

### Barrel exports

Import shared UI from `@/components` (barrel in `src/components/index.ts`). Feature-specific components import directly from their folder.

---

## 5. Data Fetching & Mutations

> **This project does NOT use Server Actions, Zod, or `revalidatePath`/`revalidateTag`.** Follow the existing BFF + SWR pattern.

### Architecture: BFF Route Handlers

```
Browser (SWR / axios-client / fetch)
    →  /api/*  (Next.js Route Handler)
        →  axios-server  →  backend /v1/*
```

For EKUID GraphQL flows:

```
Browser (axios-client)
    →  /api/ekuid/*
        →  Apollo Client  →  API_EKUID_URL
```

### Client-side fetching (pages & components)

- **SWR** with the global fetcher (`fetch(url).then(res => res.json())`) for read operations
- **axios-client** for mutations and auth flows (benefits from 401 refresh interceptor)
- **Custom hooks** in `src/hooks/` wrap SWR for reusable list queries

```tsx
const { data, isLoading, error } = useSWR<EventData>(`/api/events/${slug}`, {
  revalidateOnFocus: false,
  revalidateIfStale: false,
});
```

### Server-side fetching (Route Handlers)

Every `src/app/api/**/route.ts` should:

1. Parse request body/params
2. Call backend via `axios-server`
3. Return normalized JSON or delegate to `handleErrorAPI(error)`

**Success response shapes (follow existing patterns):**

```ts
// Auth mutations
{ success: true, message: '...', data: user }

// Data reads
NextResponse.json(data.body)           // pass-through from backend
{ success: true, data: ..., message: '...' }
```

**Auth token forwarding:**

> ⚠️ `src/proxy.ts` matcher **excludes `/api/*`**. Authorization header injection applies to **page requests only**, not Route Handlers.

- **Page navigation:** `proxy.ts` sets `Authorization: Bearer <access_token>` when the cookie exists
- **Route Handlers (canonical):** read the httpOnly cookie and forward manually:

```ts
const token = req.cookies.get('access_token')?.value;
if (!token) {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
const { data } = await axios.get('/v1/…', {
  headers: { Authorization: `Bearer ${token}` },
});
```

Reference: `src/app/api/auth/me/route.ts`

- Some existing routes use `request.headers.get('authorization')` — prefer **cookie read** for new authenticated routes (browser `fetch`/SWR sends cookies but not `Authorization` headers)
- Login/refresh set cookies via `setAuthCookies()` in `src/lib/session/index.ts`

### Mutations from client

```ts
// Pattern 1: axios-client → /api/*
await axios.post('/api/auth/login', { origin: pathname, form: formData });

// Pattern 2: fetch → /api/*
const response = await fetch('/api/order/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const result = await response.json();
if (result.success) { /* ... */ }
```

### Form validation

Use **react-hook-form** with validators from `src/utils/form-validation/`:

```ts
import { email, phoneNumber, validatePassword } from '@/utils/form-validation';
```

Do **not** introduce Zod unless the team explicitly adopts it project-wide.

### Order → Transaction flow

1. `POST /api/order/create` → creates order, stores `orderId` + `expiredAt` in `orderBookingAtom` (sessionStorage-backed)
2. User completes contact/visitor forms on `/event/[slug]/order`
3. `POST /api/transaction/create` → creates transaction with payment method + analytics metadata
4. Redirect to `/checkout-payment/[id]` → `/payment-success/[id]`

---

## 6. Error Handling

> **No `error.tsx` or `loading.tsx` route files exist.** Do not add them unless explicitly requested — use the patterns below.

### API Route Handlers

Always catch errors and return via `handleErrorAPI()` from `@/lib/api/error-handler`:

```ts
import { handleErrorAPI } from '@/lib/api/error-handler';

export async function GET(req: NextRequest) {
  try {
    const { data } = await axios.get('/v1/...');
    return NextResponse.json(data.body);
  } catch (error) {
    return handleErrorAPI(error);
  }
}
```

**Backend error shape forwarded as-is:**

```ts
{ code?: string | number; message: string; detail?: { error_code?: string; ... } }
```

GraphQL routes (EKUID) use inline GraphQL error handling or `handleGraphQLErrorAPI()`.

### Client-side errors

- **`getErrorMessage(error)`** — extract backend `message` from Axios errors
- **`useSnackBar()`** — toast-style feedback in auth forms
- **Inline `<Box className="text-red-500">`** — SWR fetch failures on event pages
- **`<Loading />`** overlay — blocking spinner during mutations (`src/components/layout/loading/`)
- **Skeleton components** — e.g. `EventPageSkeleton` during SWR loading

### Auth errors

- **401 on axios-client** → automatic token refresh via `/api/auth/refresh-token`; on failure → logout redirect to `/login` or `/ticket/auth`
- **403 on login** → role mismatch (buyer vs staff portal) or unverified user modal

### Serialized errors from actions

N/A — no Server Actions. Route Handlers return JSON with appropriate HTTP status codes; client reads `response.data.message` or `result.error`.

---

## 7. ⛔ Don'ts

### Architecture & data

- **Don't add Prisma, Drizzle, or any local ORM** — there is no database in this repo
- **Don't call `INTERNAL_API_BASE_URL` or backend `/v1/*` from the browser** — always go through `/api/*` Route Handlers
- **Don't introduce Server Actions** — use Route Handlers in `src/app/api/`
- **Don't add Zod** unless explicitly adopted — use existing `utils/form-validation` helpers
- **Don't use `revalidatePath` / `revalidateTag`** — not part of this project's cache strategy; SWR handles client revalidation

### Auth & security

- **Don't bypass `src/proxy.ts` auth/route guards** — protected routes (`/tickets`), role-based redirects (staff vs buyer), and login redirects are enforced there
- **Don't store JWT tokens in localStorage** — auth uses httpOnly cookies (`access_token`, `refresh_token`, `user_role`)
- **Don't create `middleware.ts`** — Next.js 16 uses **`proxy.ts`** with exported `proxy()` function
- **Don't skip role checks** when adding staff-only or buyer-only routes — update `protectedRoutes`, `staffOnlyRoutes`, `buyerOnlyRoutes` in `proxy.ts`

### Rendering & navigation

- **Don't use `next/navigation`'s `useRouter`/`Link` for locale-aware navigation** — use `@/lib/i18n/navigation`
- **Don't fetch backend data in Server Component pages** for interactive views — the dominant pattern is client SWR → `/api/*` (exception: `generateMetadata` in layouts may fetch for SEO)
- **Don't add `'use client'` to pages that only need static content** — keep marketing/legal pages as Server Components where possible

### UI & dependencies

- **Don't import from `@/components/ui` or add shadcn/ui** — use `src/components/common/` primitives
- **Don't install packages without `--legacy-peer-deps`** — React 19 peer dependency conflicts
- **Don't use `next lint`** — removed in Next.js 16; use ESLint directly or IDE

### Code quality

- **Don't use `any` for new code** — define interfaces co-located with features (existing axios-client has eslint-disable; don't spread that pattern)
- **Don't use `useEffect` for initial data fetching in new code** when SWR is appropriate — prefer `useSWR` / custom hooks
- **Don't hardcode API URLs** — use `INTERNAL_API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, `API_EKUID_URL` env vars

### AI-specific pitfalls (common agent mistakes)

- **Don't assume `proxy.ts` protects or enriches `/api/*` requests** — the matcher explicitly excludes `api`; auth in Route Handlers must read `access_token` from cookies (see §5)
- **Don't create routes under `src/app/` without `[locale]/`** unless intentionally global (only `coming-soon/` is an exception today)
- **Don't use `useTranslations()` in Server Components** — use `getTranslations()` from `next-intl/server`, or move translated UI into a `'use client'` child
- **Don't forget `await params` / `await cookies()`** in new layouts, pages, and Route Handlers (Next.js 16 breaking change)
- **Don't copy patterns from `black-hole`** (admin app) — this repo is a BFF with no local DB and different routing/auth constraints

---

## 8. Entity Relationships

> Domain models live in the **external backend API**, not in this repo. Types are inferred from API responses and defined in component/route files. Below is the ticketing domain cheat sheet.

```
EventOrganizer (1) ──< (N) Event
Event (N) ──> (1) City
Event (1) ──< (N) TicketType
Event (1) ──< (N) GroupTicket
Event (1) ──< (N) EventAsset ──> Asset
Event (N) ──< (N) PaymentMethod

TicketType (1) ──< (N) AdditionalForm     # visitor custom fields
TicketType (0..1) ── Discount
TicketType (0..1) ── PartnershipInfo    # partner_code quotas/pricing

GroupTicket (N) ──> (1) TicketType       # bundle: bundle_quantity tickets at bundle price

User (buyer) ──< Order ──> TicketType | GroupTicket
Order (1) ──> (1) Transaction
Transaction (N) ──> (1) PaymentMethod
Transaction (N) ──> (1) Event
Transaction (1) ──< (N) Ticket (issued)  # visitor_name, ticket_status, redeemed_at

TicketInvitation (1) ──< (N) Ticket      # invitation/[id]/tickets flow
```

### Key entities

| Entity | Key fields | Notes |
|---|---|---|
| **EventOrganizer** | `id`, `name`, `email`, `bank_information`, `asset` | Owns events; shown on event detail page |
| **Event** | `id`, `name`, `metaUrl` (slug), `eventStatus`, `startDate`, `endDate`, `login_required` | Status `draft` disables ticket purchase |
| **TicketType** | `id`, `event_id`, `price`, `quantity`, `max_order_quantity`, `sales_start/end_date` | Single ticket SKU |
| **GroupTicket** | `id`, `ticket_type_id`, `bundle_quantity`, `price`, `quantity` | Bundle SKU referencing a TicketType |
| **PartnershipInfo** | `partner_code`, `available_quota`, `max_order_quantity`, `discount`, `expired_at` | Applied via `?partner_code=` query param |
| **Order** | `id`, `ticketTypeId`, `groupTicketId`, `quantity`, `expiredAt` | Temporary booking before payment |
| **Transaction** | `id`, `transactionNumber`, `status`, `expiresAt`, `paymentMethod`, `paymentDetails` | Created at checkout |
| **Ticket (issued)** | `id`, `transaction_id`, `ticket_type_id`, `visitor_name`, `ticket_status`, `checked_in_at` | Shown in My Tickets; scanned by staff |
| **User** | `id`, `fullName`, `email`, `phoneNumber`, `role`, `isVerified` | Roles: `buyer`, `ground_staff`, `event_organizer_pic`, `admin` |

### Ticketing purchase flow

```
Event → select TicketType | GroupTicket
  → Order (expiresAt countdown)
    → contact + visitor AdditionalForm data
      → Transaction + PaymentMethod
        → Payment (VA / QRIS)
          → issued Tickets
```

### Type definition locations

| Domain | File |
|---|---|
| Event + TicketType + GroupTicket | `src/components/event/event-detail-section/event.ts` |
| Ticket selection UI | `src/components/event/types.ts` |
| My tickets list | `src/components/tickets/types.ts` |
| Auth user | `src/store/atoms/auth.ts` |
| Order booking state | `src/store/atoms/order.ts` |

When adding new fields, extend the relevant interface in these files — do not create a global `types/` directory unless the team standardizes one.

---

## 9. Environment Variables

Copy `.env.example` to `.env.local` for local dev. **`.env.example` is incomplete** — the table below lists vars actually referenced in code.

### Required for core functionality

| Variable | Used by | Purpose |
|---|---|---|
| `INTERNAL_API_BASE_URL` | `src/lib/api/axios-server` | Server-side backend REST base URL (preferred) |
| `NEXT_PUBLIC_API_BASE_URL` | `axios-server` fallback | Public fallback if internal URL unset |

### Auth & security

| Variable | Used by | Purpose |
|---|---|---|
| `SECRET_PREVIEW_TOKEN` | `src/lib/utils/encryptUtils.ts` | Decrypt `preview_token` cookie for draft event previews |
| `SECRET_COOKIE_PASSWORD` | `.env.example` only | Listed but verify usage before relying on it |
| `STAGING` | `src/app/api/auth/forgot-password/route.ts` | Set to `'true'` for staging-specific forgot-password behavior |

### EKUID GraphQL

| Variable | Used by | Purpose |
|---|---|---|
| `API_EKUID_URL` | `src/lib/api/apollo-client` | GraphQL endpoint for organizer registration |
| `RESTURL_CORS` | `apollo-client` auth link | `origin` header sent to GraphQL API |

### Public / client-side

| Variable | Used by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | `src/config/seo.ts` | Canonical site URL for metadata |
| `NEXT_PUBLIC_API_URL` | `event/[slug]/layout.tsx` | **Not in `.env.example`** — base URL for server-side metadata fetch to own `/api/*` routes; defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_ASSET_BASE_URL` | `auth-layout` | CDN/base for auth page assets |
| `NEXT_PUBLIC_CREATOR_BASE_URL` | `become-creator/page.tsx` | External creator portal link |
| `NEXT_PUBLIC_GTM_ID` | `src/app/layout.tsx` | Google Tag Manager |
| `NEXT_PUBLIC_POSTHOG_KEY` / `HOST` | Analytics (if enabled) | PostHog |
| `NEXT_PUBLIC_APP_VERSION` | `layout.tsx`, footer | Display version; falls back to `package.json` |
| `NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION` | `layout.tsx` metadata | Facebook domain verification meta tag |

### Production / Docker build

- **`staging.dockerfile`** copies **`.env.production`** at build time — this file must exist (or be generated) before `docker build`
- Build uses `npm install --legacy-peer-deps` then `npm run build`
- Output mode: `standalone` (see `next.config.ts`)

---

## 10. CI/CD & Deployment

| Trigger | Action |
|---|---|
| PR merged to `develop` | Docker image `black-void-stag:<sha>` pushed; deploy to **staging** via `byteplus-infra` repository dispatch |
| PR merged to `main` | Docker image `black-void:<sha>` pushed; deploy to **prod** |

Workflow file: `.github/workflows/docker-publish.yml`

**CI constraints for agents:**

- Do not change `output: 'standalone'` without coordinating with Docker/deployment
- Docker build requires `.env.production` — env vars baked at build time for `NEXT_PUBLIC_*`
- No automated test gate in CI workflow today — run `npm test` locally before PR
- Jest coverage thresholds (70% global) enforced in `config/jest.config.js` when running tests with coverage
- Format with `npm run format` (Prettier config at `config/.prettierrc.json`)

---

## Quick Reference: Adding a New Feature

1. **Page** → `src/app/[locale]/(main)/my-feature/page.tsx` (Server Component shell + metadata)
2. **Component** → `src/components/my-feature/index.tsx` (`'use client'` if interactive)
3. **API** → `src/app/api/my-feature/route.ts` (axios-server → `/v1/...`, handleErrorAPI)
4. **Hook** (optional) → `src/hooks/use-my-feature.ts` (SWR wrapper)
5. **i18n** → add keys to `src/lib/i18n/messages/en.json` and `id.json`
6. **Auth** → if route needs protection, update arrays in `src/proxy.ts`
7. **Test** → co-locate `*.test.tsx` next to the component
