---
description: Add a mutation in black-void — BFF Route Handler (not Server Actions), request validation, error handling, and client cache refresh via SWR.
---

# /add-action — Add a Mutation (API Route Handler)

Use this workflow when adding a **write operation** (create, update, delete) to the app.

> ⚠️ **This project does NOT use Next.js Server Actions, Zod, or `revalidatePath`.**
> Mutations are implemented as **Route Handlers** in `src/app/api/` that proxy to the backend REST API (`/v1/*`) or EKUID GraphQL. Client cache is refreshed with **SWR `mutate`**, not Next.js cache revalidation.

> ⚠️ **`src/proxy.ts` does NOT run on `/api/*` routes.** Authenticated Route Handlers must read `access_token` from cookies — do not assume `Authorization` header is present.

> **Reference:** `.gemini/rules.md` §5 (data fetching), §6 (error handling), §9 (env vars)

---

## Architecture overview

```
Client form / button
  → axios-client POST /api/my-action   (or fetch)
    → src/app/api/my-action/route.ts
      → axios-server POST /v1/my-action   (REST)
      → OR apollo-client mutate           (EKUID GraphQL)
        → External backend API
```

---

## 1. Choose the API path

| Backend type | Route location | HTTP client |
|---|---|---|
| REST (`/v1/*`) | `src/app/api/<resource>/route.ts` | `@/lib/api/axios-server` |
| REST with param | `src/app/api/<resource>/[id]/route.ts` | `@/lib/api/axios-server` |
| EKUID GraphQL | `src/app/api/ekuid/<action>/route.ts` | `@/lib/api/apollo-client` |

Naming: **kebab-case**, mirror backend resource names.

Examples in this repo:

- `src/app/api/order/create/route.ts` → `POST /v1/orders`
- `src/app/api/transaction/create/route.ts` → `POST /v1/transactions`
- `src/app/api/auth/login/route.ts` → `POST /v1/auth/login` + cookie setup
- `src/app/api/ekuid/register-event-organizer/route.ts` → GraphQL mutation

---

## 2. Create the Route Handler

### REST mutation template

Reference: `src/app/api/order/create/route.ts` (public), `src/app/api/auth/me/route.ts` (auth)

```ts
// src/app/api/my-resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // --- Validation (see §3) ---
    if (!body.requiredField) {
      return NextResponse.json(
        { message: 'requiredField is required', success: false },
        { status: 400 }
      );
    }

    // Auth: read httpOnly cookie (proxy does NOT run on /api/*)
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    const { data } = await axios.post('/v1/my-resource', body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({
      success: true,
      message: data.message,
      data: data.body ?? data.order ?? data,
    });
  } catch (error) {
    return handleErrorAPI(error);
  }
}
```

### Dynamic route params (Next.js 16)

```ts
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   // must await
  // …
}
```

Reference: `src/app/api/events/[slug]/route.ts`, `src/app/api/transaction/[id]/route.ts`

### Auth-aware mutation (cookies)

Reference: `src/app/api/auth/login/route.ts`

```ts
import { setAuthCookies } from '@/lib/session';

// After successful backend login:
await setAuthCookies({
  accessToken: body.accessToken,
  refreshToken: body.refreshToken,
  userRole: body.user.role,
});
```

Or read token directly:

```ts
const token = request.cookies.get('access_token')?.value;
if (!token) {
  return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
}
```

### GraphQL mutation template (EKUID)

Reference: `src/app/api/ekuid/register-event-organizer/route.ts`

1. Add query/mutation string in `src/lib/api/queries/ekuid-queries.ts`
2. Call from route:

```ts
import client from '@/lib/api/apollo-client';
import { MY_MUTATION } from '@/lib/api/queries/ekuid-queries';
import { handleGraphQLErrorAPI } from '@/lib/api/error-handler';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const response = await client.mutate({
      mutation: MY_MUTATION,
      variables: { input: payload },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return handleGraphQLErrorAPI(error);
  }
}
```

---

## 3. Request validation (replaces Zod in this project)

**Do not add Zod** unless the team adopts it project-wide. Use:

### Server-side (Route Handler)

Manual guards before calling the backend:

```ts
if (!body.tickets?.length) {
  return NextResponse.json({ message: 'tickets is required' }, { status: 400 });
}
```

For complex shapes, define a TypeScript interface at the top of the route file or in a co-located `types.ts`:

```ts
interface CreateOrderPayload {
  tickets: Array<{
    ticketTypeId?: string;
    groupTicketId?: string;
    quantity: number;
    partnerCode?: string | null;
  }>;
}
```

### Client-side (forms)

Use **react-hook-form** + validators from `src/utils/form-validation/`:

```ts
import { email, phoneNumber, validatePassword } from '@/utils/form-validation';

// In form component:
const methods = useForm<FormData>({ mode: 'onChange' });
// Pass rules to TextField: rules={{ validate: email }}
```

Reference: `src/components/auth/login/form.tsx`, `src/components/event-funding/funding-form-section/index.tsx`

---

## 4. Error handling (try/catch pattern)

Every Route Handler **must** follow this pattern:

```ts
try {
  // business logic
  return NextResponse.json({ success: true, data });
} catch (error) {
  return handleErrorAPI(error);   // REST
  // OR
  return handleGraphQLErrorAPI(error);  // GraphQL
}
```

`handleErrorAPI` (`src/lib/api/error-handler/index.ts`) forwards the backend body:

```ts
{ code?: string | number; message: string; detail?: { error_code?: string } }
```

### Client-side error display

```ts
import { getErrorMessage } from '@/lib/api/error-handler';
import { useSnackBar } from '@/utils/use-snack-bar';

try {
  await axios.post('/api/my-action', payload);
} catch (error) {
  showError(getErrorMessage(error));
}
```

---

## 5. Cache refresh (replaces revalidatePath)

This project has **no server-side cache revalidation**. After a successful mutation:

### Option A — SWR mutate (preferred for list/detail views)

```ts
import { useSWRConfig } from 'swr';

const { mutate } = useSWRConfig();

await axios.post('/api/my-action', payload);
await mutate('/api/my-resource');           // re-fetch one key
await mutate(key => typeof key === 'string' && key.startsWith('/api/events'));  // re-fetch pattern
```

### Option B — Redirect to fresh page

Reference: order flow in `src/app/[locale]/(main)/event/[slug]/page.tsx`:

```ts
if (result.success) {
  router.push(`/event/${slug}/order`);
}
```

### Option C — Update Jotai atom

Reference: `src/store/atoms/order.ts` — `orderBookingAtom` after order creation.

---

## 6. Client service layer (optional)

For reusable client calls, add to `src/services/`:

```ts
// src/services/my-resource.ts
import axios from '@/lib/api/axios-client';

export const createMyResource = async (payload: CreatePayload) => {
  const { data } = await axios.post('/api/my-resource', payload);
  return data;
};
```

Reference: `src/services/ekuid.ts`

---

## 7. Wire up the UI

### Form submission

Reference: `src/components/auth/login/form.tsx`

```tsx
'use client';

const onSubmit = async (formData: FormData) => {
  setLoading(true);
  try {
    const response = await axios.post('/api/my-action', { form: formData });
    if (response.data.success) {
      // mutate / redirect / update atom
    }
  } catch (error) {
    showError(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};
```

### Non-form action (button click)

Reference: `handleContinue` in `src/app/[locale]/(main)/event/[slug]/page.tsx` — uses `fetch('/api/order/create', …)`.

Show `<Loading />` overlay during the request.

---

## 8. Add tests

Reference: `src/app/api/auth/login/route.test.ts`

```ts
// src/app/api/my-resource/route.test.ts
import { POST } from './route';
import axios from '@/lib/api/axios-server';

jest.mock('@/lib/api/axios-server');
jest.mock('@/lib/api/error-handler', () => ({
  handleErrorAPI: jest.fn(),
}));

describe('POST /api/my-resource', () => {
  it('returns success when backend succeeds', async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { message: 'OK', body: { id: '1' } },
    });
    const {status: 200, body: { success: true, … }}
  });

  it('returns 400 when required field missing', async () => {
    // …
  });
});
```

Run: `npm test -- src/app/api/my-resource/route.test.ts`

---

## 9. Verify

```bash
# Dev — test the route directly
curl -X POST http://localhost:3000/api/my-resource \
  -H "Content-Type: application/json" \
  -d '{"requiredField":"value"}'

npm test -- src/app/api/my-resource/route.test.ts
npm run build
```

Checklist:

- [ ] Route Handler in `src/app/api/`, not a Server Action file
- [ ] Uses `axios-server`, never calls `INTERNAL_API_BASE_URL` from client
- [ ] `try/catch` with `handleErrorAPI` / `handleGraphQLErrorAPI`
- [ ] Input validated manually (no Zod unless team adopts)
- [ ] Auth reads `access_token` **cookie** for protected routes (proxy excludes `/api/*`)
- [ ] `await context.params` for dynamic segments (Next.js 16)
- [ ] Client refreshes data via SWR `mutate` or redirect (no `revalidatePath`)
- [ ] Co-located `route.test.ts` passes
