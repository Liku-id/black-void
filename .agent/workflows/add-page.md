---
description: Add a new localized route in black-void — folder setup, page.tsx, Metadata API, Suspense, i18n, and proxy auth guards.
---

# /add-page — Add a New Route

Use this workflow when adding a buyer-facing, auth, payment, or partner page under the App Router.

> **Reference:** `.gemini/rules.md` §2 (structure), §3 (rendering), §4 (naming)

---

## 0. Decide route placement

| URL you want | Create under |
|---|---|
| `/my-page` (public buyer) | `src/app/[locale]/(main)/my-page/` |
| `/login`, `/register`, … | `src/app/[locale]/(auth)/…/` |
| `/checkout-payment/[id]` | `src/app/[locale]/(payment)/…/` |
| `/ticket/scanner` | `src/app/[locale]/(partner)/…/` |

- Folder name: **kebab-case** (`event-funding`, not `eventFunding`)
- Route groups `(main)`, `(auth)`, etc. **do not** appear in the URL
- Final URL is always locale-prefixed: `/en/my-page`, `/id/my-page`
- **All new localized pages must live under `src/app/[locale]/`** — do not create `src/app/my-page/` (only `coming-soon/` is a deliberate non-locale exception)

### Auth guard (if needed)

If the page requires login or role restriction, update `src/proxy.ts`:

```ts
// Paths are checked WITHOUT locale prefix (proxy strips /en or /id)
// protectedRoutes / staffOnlyRoutes / buyerOnlyRoutes use startsWith matching
const protectedRoutes = ['/tickets'];           // requires access_token
const staffOnlyRoutes = ['/ticket/scanner'];    // ground_staff | event_organizer_pic | admin
const buyerOnlyRoutes = ['/event', '/transaction', …];
const restrictedWhenLoggedIn = ['/login', '/register', …];  // exact match
```

---

## 1. Create the folder & files

**Static / marketing page** (Server Component):

```
src/app/[locale]/(main)/my-page/
├── page.tsx
└── page.test.tsx          # optional but preferred
```

**Dynamic segment:**

```
src/app/[locale]/(main)/my-feature/[id]/
├── page.tsx
├── layout.tsx             # only if generateMetadata needs segment data
└── page.test.tsx
```

**Interactive page** (SWR, forms, hooks) — use hybrid split:

```
src/app/[locale]/(main)/my-page/
├── page.tsx               # Server Component shell
└── page.test.tsx

src/components/my-page/
├── index.tsx              # 'use client' feature component
└── index.test.tsx
```

---

## 2. Implement `page.tsx`

### Pattern A — Static Server Component (preferred for marketing/legal)

Reference: `src/app/[locale]/(main)/about-us/page.tsx`

```tsx
import { getTranslations } from 'next-intl/server';
import { createLocalizedMetadata } from '@/config/seo';
import MySection from '@/components/my-page/my-section';

export const generateMetadata = createLocalizedMetadata('myPage', 'metadata.my_page');

export default async function MyPage() {
  const t = await getTranslations('myPage');

  return (
    <main className="bg-black text-white min-h-screen">
      <MySection title={t('hero.title')} />
    </main>
  );
}
```

### Pattern B — Static metadata from SEO config

Reference: `src/app/[locale]/(main)/cookie-policy/page.tsx` (thin Server Component + legal component)

```tsx
import { Metadata } from 'next';
import { SEO_CONFIG } from '@/config/seo';
import MyContent from '@/components/legal/my-content';

export const metadata: Metadata = SEO_CONFIG.pages.myPage;

export default function MyPage() {
  return <MyContent />;
}
```

Add the entry first in `src/config/seo.ts` under `SEO_CONFIG.pages`.

> If the page needs `useTranslations()` (client hook), the **page or section must be `'use client'`** — do not follow `event-funding/page.tsx` which mixes client hooks in a Server Component file.

### Pattern C — Dynamic metadata (slug/id routes)

Reference: `src/app/[locale]/(main)/event/[slug]/layout.tsx`

```tsx
// layout.tsx
import { Metadata } from 'next';
import { generateEventMetadata } from '@/config/seo';
import axios from 'axios';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;   // Next.js 16: params is a Promise
  try {
    const { data } = await axios.get(
      // NEXT_PUBLIC_API_URL is used for server-side self-fetch to own BFF routes
      // Set in .env.local — not listed in .env.example; defaults to localhost:3000
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/events/${slug}`
    );
    return generateEventMetadata(data?.name);
  } catch {
    return generateEventMetadata();
  }
}

export default async function MyLayout({ params, children }: Props) {
  await params;   // Next.js 16: always await params even if unused
  return <>{children}</>;
}
```

### Pattern D — Interactive page (hybrid)

Reference: `src/app/[locale]/(payment)/checkout-payment/[id]/page.tsx`

```tsx
// page.tsx — stays a Server Component (no 'use client')
import dynamic from 'next/dynamic';

const MyFeature = dynamic(() => import('@/components/my-page'));

export default function MyPage() {
  return <MyFeature />;
}
```

```tsx
// src/components/my-page/index.tsx
'use client';

import useSWR from 'swr';

export default function MyFeature() {
  const { data, isLoading, error } = useSWR('/api/my-feature');
  // …
}
```

> **Do not** add `'use client'` to `page.tsx` unless the entire page is interactive and cannot be split (see `src/app/[locale]/(main)/event/[slug]/page.tsx` — prefer Pattern D for new pages).

---

## 3. Metadata API checklist

| Scenario | Approach | File to edit |
|---|---|---|
| Static page, single locale metadata | `export const metadata = SEO_CONFIG.pages.x` | `src/config/seo.ts` |
| Static page, per-locale metadata | `createLocalizedMetadata('pageKey', 'namespace')` | `src/config/seo.ts` + `src/lib/i18n/messages/{en,id}.json` |
| Dynamic entity (event, etc.) | `generateMetadata` in `layout.tsx` | `src/config/seo.ts` helpers |
| Root title template | Already set in `src/app/layout.tsx` → `%s \| Wukong` | — |

### Add i18n metadata keys

```json
// src/lib/i18n/messages/en.json
{
  "metadata": {
    "my_page": {
      "title": "My Page Title",
      "description": "My page description for SEO."
    }
  }
}
```

Mirror the same keys in `src/lib/i18n/messages/id.json`.

---

## 4. Suspense boundaries

This project **does not** use route-level `loading.tsx`. Use Suspense inline:

### When `useSearchParams` is used

Reference: `src/components/tracking/tracking-provider.tsx`, `src/app/[locale]/(payment)/layout.tsx`

```tsx
import { Suspense } from 'react';
import MyClientSection from '@/components/my-page/client-section';

export default function MyPage() {
  return (
    <Suspense fallback={null}>
      <MyClientSection />
    </Suspense>
  );
}
```

### Layout-level Suspense (header with search params)

Reference: `src/app/[locale]/(main)/layout.tsx`

```tsx
<Suspense fallback={null}>
  <Header />
</Suspense>
```

### Loading states for data fetching

Use component-level loaders, not route `loading.tsx`:

- `<Loading />` from `@/components/layout/loading` — full-screen overlay during mutations
- Skeleton components — e.g. `EventPageSkeleton` during SWR `isLoading`
- Inline error: `<Box className="text-red-500">Failed to load</Box>`

---

## 5. Wire up supporting files

### i18n copy (if page has translated text)

1. Add keys to `src/lib/i18n/messages/en.json` and `id.json`
2. Server: `getTranslations('myPage')` from `next-intl/server`
3. Client: `useTranslations('myPage')` from `next-intl`

### Navigation links

Use locale-aware navigation — **not** raw `next/link` for internal routes:

```tsx
import { Link } from '@/lib/i18n/navigation';

<Link href="/my-page">Go</Link>
```

### Data fetching (if interactive)

1. Create BFF route: `src/app/api/my-feature/route.ts` (see `/add-action` workflow)
2. Optional SWR hook: `src/hooks/use-my-feature.ts`
3. Fetch in client component via `useSWR('/api/my-feature')`

---

## 6. Add tests

Co-locate next to the page:

```tsx
// src/app/[locale]/(main)/my-page/page.test.tsx
import { render, screen } from '@testing-library/react';
import MyPage from './page';

// Mock next-intl, dynamic imports, etc. as needed
describe('MyPage', () => {
  it('renders heading', () => {
    // …
  });
});
```

Reference existing tests: `src/app/[locale]/(main)/about-us/page.test.tsx`

---

## 7. Verify

```bash
npm run dev
# Visit http://localhost:3000/en/my-page
# Visit http://localhost:3000/id/my-page

npm test -- src/app/[locale]/(main)/my-page/page.test.tsx
npm run build
```

Checklist:

- [ ] Page lives under `src/app/[locale]/…` (not bare `src/app/…`)
- [ ] Page renders at `/en/…` and `/id/…`
- [ ] Metadata appears in `<head>` (title, description)
- [ ] Auth redirect works (if route is protected in `src/proxy.ts`)
- [ ] No `'use client'` on page unless unavoidable; no `useTranslations` in Server Components
- [ ] `params` / `cookies()` awaited where used (Next.js 16)
- [ ] Internal links use `@/lib/i18n/navigation`
- [ ] SWR/fetch calls go to `/api/*`, not backend URL directly
