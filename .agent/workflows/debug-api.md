---
description: Debug API errors in black-void — trace from client through BFF Route Handlers to the external backend (no local database).
---

# /debug-api — Debug API Errors

Use this workflow when a `/api/*` call fails, returns unexpected data, or auth breaks mid-request.

> **This project has no local database or service layer.** The stack is:
>
> `Client (SWR / axios-client / fetch)` → `Route Handler (src/app/api/)` → `axios-server` → **External REST API (`/v1/*`)**
>
> EKUID flows add: `Route Handler` → `apollo-client` → **GraphQL (`API_EKUID_URL`)**

> ⚠️ **Critical:** `src/proxy.ts` matcher **excludes `/api/*`**. Page requests get `Authorization` injected; API Route Handlers must read `access_token` from cookies themselves.

> **Reference:** `.gemini/rules.md` §5–§6, §9–§10, `src/lib/api/error-handler/index.ts`

---

## 1. Identify the failing layer

| Symptom | Likely layer | Where to look |
|---|---|---|
| Network error in browser DevTools on `/api/…` | BFF Route Handler | `src/app/api/<path>/route.ts` |
| 401 on authenticated `/api/*` (no redirect) | Route Handler missing cookie → Bearer | Route only checks `authorization` header, not cookie |
| 401 → redirect to `/login` | axios-client interceptor | `src/lib/api/axios-client/index.ts` |
| 403 on page load / redirect loop | Proxy auth guard | `src/proxy.ts` |
| `{ message, code, detail }` JSON error | Backend rejected request | Backend API + Route Handler payload |
| SWR shows stale/empty data | Client cache | SWR key + Route Handler response shape |
| GraphQL `extensions.status_code` | EKUID API | `src/app/api/ekuid/*/route.ts` |

---

## 2. Trace from the browser (top-down)

### Step 2a — Find the client call site

Search for the API path:

```bash
rg "/api/my-endpoint" src/
```

Common call patterns:

| Pattern | File example |
|---|---|
| SWR | `useSWR('/api/events/${slug}')` in page/component |
| axios-client | `axios.post('/api/auth/login', …)` in forms |
| fetch | `fetch('/api/order/create', …)` in event page |
| Custom hook | `src/hooks/use-events.ts` |
| Service | `src/services/ekuid.ts` |

### Step 2b — Inspect the network request

In browser DevTools → Network:

1. Confirm request URL is `/api/…` (not `INTERNAL_API_BASE_URL`)
2. Check **Request payload** matches what the Route Handler expects
3. Check **Response** body shape:

```json
// Success (typical)
{ "success": true, "data": { … }, "message": "…" }

// Error (from handleErrorAPI)
{ "code": "…", "message": "Human-readable error", "detail": { "error_code": "…" } }
```

### Step 2c — Client error extraction

```ts
import { getErrorMessage } from '@/lib/api/error-handler';
// Reads error.response.data.message from Axios errors
```

Reference: `src/components/auth/login/form.tsx`

---

## 3. Trace the Route Handler (BFF layer)

### Step 3a — Open the matching route file

Map URL → file:

| Request URL | Route file |
|---|---|
| `GET /api/events/[slug]` | `src/app/api/events/[slug]/route.ts` |
| `POST /api/order/create` | `src/app/api/order/create/route.ts` |
| `GET /api/auth/me` | `src/app/api/auth/me/route.ts` |
| `POST /api/ekuid/register-event-organizer` | `src/app/api/ekuid/register-event-organizer/route.ts` |

### Step 3b — Check the handler checklist JSON

Every REST handler should follow:

```ts
try {
  const body = await request.json();          // or searchParams / params
  const authHeader = request.headers.get('authorization');
  const { data } = await axios.get/post('/v1/…', payload, {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  return NextResponse.json({ success: true, data: data.body });
} catch (error) {
  return handleErrorAPI(error);
}
```

Verify:

- [ ] Correct HTTP method exported (`GET`, `POST`, …)
- [ ] `context.params` awaited (Next.js 16): `const { id } = await context.params`
- [ ] Auth header forwarded from proxy or read from cookies
- [ ] Payload shape matches backend expectation (compare with similar routes)
- [ ] Response normalizes backend shape (`data.body`, `data.order`, etc.)

### Step 3c — Test the Route Handler in isolation

Reference: `src/app/api/auth/login/route.test.ts`

```bash
npm test -- src/app/api/<path>/route.test.ts
```

Or curl against dev server:

```bash
curl -v http://localhost:3000/api/auth/me \
  -H "Cookie: access_token=YOUR_TOKEN"
```

---

## 4. Trace axios-server → backend

### Step 4a — Check environment variables

See `.gemini/rules.md` §9 for the full table. Minimum for API debugging:

```
INTERNAL_API_BASE_URL=       # Server-side backend URL (preferred)
NEXT_PUBLIC_API_BASE_URL=    # Fallback for axios-server
API_EKUID_URL=               # GraphQL (EKUID routes only)
RESTURL_CORS=                # Apollo origin header
SECRET_PREVIEW_TOKEN=        # Event preview_token decryption
NEXT_PUBLIC_API_URL=         # Server-side self-fetch for generateMetadata (not in .env.example)
```

`src/lib/api/axios-server/index.ts`:

```ts
baseURL: process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
```

If `baseURL` is empty, all `/v1/*` calls fail or hit the wrong host.

### Step 4b — Identify the backend endpoint

In the Route Handler, find the axios call:

```ts
await axios.post('/v1/orders', payload);     // → {baseURL}/v1/orders
await axios.get('/v1/events/${slug}');       // → {baseURL}/v1/events/:slug
```

There is **no ORM or local service layer** — this is the final hop before the external API.

### Step 4c — Reproduce against backend directly

```bash
curl -v "${INTERNAL_API_BASE_URL}/v1/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"ticketTypeId":"…","quantity":1}'
```

Compare backend response with what the Route Handler returns to the client.

---

## 5. Debug auth failures

Auth spans three layers — check in order:

### 5a — `src/proxy.ts` (page routes only — NOT `/api/*`)

The proxy matcher excludes `api`:

```ts
// src/proxy.ts config.matcher
'/((?!api|ingest|_next/static|…).*)'
```

Proxy auth checks apply when **navigating to pages**, not when calling Route Handlers.

- Is `access_token` cookie present?
- Is the user on a `protectedRoutes`, `staffOnlyRoutes`, or `buyerOnlyRoutes` path?
- Does `user_role` cookie match the route requirement?

```ts
// proxy injects Authorization for PAGE requests only:
requestHeaders.set('Authorization', `Bearer ${accessToken}`);
```

### 5b — Route Handler (required for `/api/*` auth)

Browser `fetch`/SWR sends **cookies** (same-origin) but **not** `Authorization` headers.

**Canonical pattern** — read cookie, forward to backend:

```ts
const token = req.cookies.get('access_token')?.value;
if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

await axios.get('/v1/…', {
  headers: { Authorization: `Bearer ${token}` },
});
```

Reference: `src/app/api/auth/me/route.ts`

**Legacy/inconsistent pattern** — some routes only check `request.headers.get('authorization')`, which will be empty from browser `fetch`. If an authenticated `/api/*` route returns 401, check whether it reads the cookie.

### 5c — `src/lib/api/axios-client/index.ts` (client refresh)

On 401 (except `/auth/login`):

1. POST `/api/auth/refresh-token` with `refresh_token` cookie
2. Retry original request
3. On refresh failure → logout redirect to `/login` or `/ticket/auth`

Check: is `refresh_token` cookie expired? Is the refresh route returning 401?

---

## 6. Debug error handler output

`handleErrorAPI` (`src/lib/api/error-handler/index.ts`) behavior:

```
Axios error with response → forward { code, message, detail } + original HTTP status
Non-Axios error            → { message } with status 500
```

### Common backend error shapes

```json
{ "message": "…", "code": 400, "detail": { "error_code": "TICKET_SOLD_OUT" } }
```

Login route has a special shape:

```ts
// src/app/api/auth/login/route.ts catch block:
e?.response?.data?.details?.[0]?.value   // field-level validation
e?.response?.data?.message               // top-level message
```

GraphQL errors use `handleGraphQLErrorAPI` or inline handling — check `extensions.status_code`.

---

## 7. Debug SWR-specific issues

Global fetcher in `src/lib/api/swr-provider/index.tsx`:

```ts
fetcher: url => fetch(url).then(res => res.json())
```

Known issues:

| Problem | Cause | Fix |
|---|---|---|
| SWR never refetches | `revalidateOnFocus: false` set explicitly | Add `mutate()` after mutation |
| Wrong data shape | Route Handler returns `{ success, data }` but component reads root | Align destructuring |
| Key is `null` | Conditional key (`slug ? url : null`) | Ensure param exists before fetch |
| Stale after mutation | No cache invalidation | `mutate('/api/…')` after POST |

Reference SWR options: `src/app/[locale]/(main)/event/[slug]/page.tsx`

---

## 8. Debug GraphQL (EKUID) routes

Flow: Client → `/api/ekuid/*` → `src/lib/api/apollo-client` → `API_EKUID_URL`

Key files:

- Queries/mutations: `src/lib/api/queries/ekuid-queries.ts`
- Example route: `src/app/api/ekuid/register-event-organizer/route.ts`
- Error helper: `handleGraphQLErrorAPI()` in `src/lib/api/error-handler/index.ts`

GraphQL errors return `extensions.status_code` — check the route's catch block for how it maps to HTTP status.

Env var required: `API_EKUID_URL`, `RESTURL_CORS` (used in apollo-client headers).

---

## 9. Systematic debug checklist

Work top-down; stop when you find the break:

```
[ ] 1. Browser Network tab — which /api/* URL failed? Status code? Response body?
[ ] 2. Client call site — correct payload? Using axios-client (not backend URL)?
[ ] 3. Route Handler — src/app/api/<path>/route.ts exists? try/catch? auth via cookie?
[ ] 4. axios-server baseURL — INTERNAL_API_BASE_URL set in .env.local?
[ ] 5. Backend direct curl — same error without Next.js in the middle?
[ ] 6. Auth chain — cookie present? Route Handler reads access_token (NOT proxy for /api)?
[ ] 7. Error handler — handleErrorAPI forwarding message correctly?
[ ] 8. SWR — correct key? mutate after write?
[ ] 9. Next.js 16 — await params/cookies in route handler?
[ ] 10. Tests — npm test -- src/app/api/<path>/route.test.ts
```

---

## 10. Quick reference — key files

| Concern | File |
|---|---|
| Browser HTTP client | `src/lib/api/axios-client/index.ts` |
| Server HTTP client | `src/lib/api/axios-server/index.ts` |
| Error normalization | `src/lib/api/error-handler/index.ts` |
| Auth cookies | `src/lib/session/index.ts` |
| Route guards | `src/proxy.ts` |
| Token refresh | `src/app/api/auth/refresh-token/route.ts` |
| SWR global config | `src/lib/api/swr-provider/index.tsx` |
| GraphQL client | `src/lib/api/apollo-client/index.ts` |
| GraphQL queries | `src/lib/api/queries/ekuid-queries.ts` |
