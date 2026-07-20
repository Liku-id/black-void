---
description: Create a reusable UI component in black-void — folder structure, TypeScript props, Tailwind + CVA styling, barrel export, and tests.
---

# /add-component — Add a Reusable UI Component

Use this workflow when adding a shared or feature-specific React component.

> **This project uses custom components in `src/components/common/` — not shadcn/ui.**
> Styling: Tailwind CSS v4 + `cn()` + CVA for variants.

> **Reference:** `.gemini/rules.md` §2 (structure), §4 (naming), §10 (CI — run tests locally before PR)

---

## 0. Decide component location

| Type | Location | Export via `@/components`? |
|---|---|---|
| Shared UI primitive (Button, Badge, …) | `src/components/common/<name>/` | **Yes** — add to `src/components/index.ts` |
| Layout (header, footer, loading) | `src/components/layout/<name>/` | Only if listed in barrel |
| Feature-specific (event, auth, payment) | `src/components/<feature>/<name>/` | **No** — import directly |
| Page section | `src/components/<feature>/<section-name>/` | **No** |

Folder name: **kebab-case**. Main file: **`index.tsx`**.

---

## 1. Create the folder structure

```
src/components/common/my-component/
├── index.tsx              # Component implementation
├── index.test.tsx         # Co-located test
└── my-component.types.ts  # Optional — only if props/types are large
```

Reference examples:

- Simple: `src/components/common/button/index.tsx`
- With types file: `src/components/common/typography/typography.types.ts`
- Feature: `src/components/event/summary-section/index.tsx`

---

## 2. Define TypeScript interfaces

Place props interface **above** the component in `index.tsx`, or in a co-located `.types.ts` file.

```tsx
// src/components/common/my-component/index.tsx

import * as React from 'react';
import { cn } from '@/utils/utils';

export interface MyComponentProps {
  /** Visible label text */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional Tailwind classes */
  className?: string;
  /** Disable interaction */
  disabled?: boolean;
  children?: React.ReactNode;
}
```

Rules:

- Export the props interface if consumed elsewhere
- Use explicit types — avoid `any` in new code
- Extend native element props when wrapping HTML elements:

```tsx
export interface MyComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}
```

---

## 3. Implement the component

### Simple component (no client interactivity)

No `'use client'` directive — stays a Server Component.

```tsx
import { Box, Typography } from '@/components';

export interface InfoCardProps {
  title: string;
  description: string;
  className?: string;
}

export function InfoCard({ title, description, className }: InfoCardProps) {
  return (
    <Box className={cn('border border-white p-4', className)}>
      <Typography type="heading" size={20} color="text-white">
        {title}
      </Typography>
      <Typography type="body" size={14} color="text-white">
        {description}
      </Typography>
    </Box>
  );
}
```

### Interactive component (needs `'use client'`)

Add `'use client'` when using hooks, event handlers, or browser APIs.

Reference: `src/components/common/text-field/index.tsx`

```tsx
'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

export interface MyComponentProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  label,
  onClick,
  className,
}) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 transition-all duration-300',
        isActive && 'shadow-[4px_4px_0px_0px_#FFFF] translate-x-[-2px] translate-y-[-2px]',
        className
      )}
    >
      {label}
    </button>
  );
};
```

---

## 4. Styling conventions

### `cn()` for class merging

Always use `cn()` from `@/utils/utils` (clsx + tailwind-merge):

```tsx
className={cn('base-classes', condition && 'conditional-class', className)}
```

### CVA for variant-based components

Reference: `src/components/common/button/index.tsx`

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

const myComponentVariants = cva(
  'inline-flex items-center justify-center transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-green text-white font-onest font-bold',
        outline: 'border border-white text-white bg-transparent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        lg: 'h-12 px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface MyComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof myComponentVariants> {}

export const MyComponent = ({ variant, size, className, ...props }: MyComponentProps) => (
  <button
    className={cn(myComponentVariants({ variant, size }), className)}
    {...props}
  />
);
```

### Design tokens used in this project

| Token | Usage |
|---|---|
| `font-onest` | Body / button text |
| `font-bebas` / `--font-bebas` | Display headings |
| `bg-green` | Primary action color |
| `text-white`, `bg-black` | Dark theme base |
| `bg-light-gray` | Section backgrounds |
| `shadow-[4px_4px_0px_0px_#FFFF]` | Focus/active offset shadow |

### Compose from existing primitives

Import shared UI from the barrel:

```tsx
import { Box, Button, Container, Typography, Modal } from '@/components';
```

Do **not** recreate Button, TextField, Modal, etc. — extend or compose them.

---

## 5. Export from barrel (common components only)

If the component lives in `src/components/common/`, add to `src/components/index.ts`:

```ts
// src/components/index.ts
export { MyComponent } from './common/my-component';
// export type { MyComponentProps } from './common/my-component';  // if needed externally
```

Feature components are imported directly:

```tsx
import SummarySection from '@/components/event/summary-section';
```

---

## 6. Integrate with forms (if applicable)

For form inputs, integrate with **react-hook-form** via `Controller` or `useFormContext`.

Reference: `src/components/common/text-field/index.tsx`

```tsx
'use client';

import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

interface TextFieldProps {
  name?: string;
  rules?: RegisterOptions;
  // …
}

// Inside component:
const formContext = useFormContext();
// Wrap input with <Controller name={name} control={formContext.control} rules={rules} … />
```

Validators come from `src/utils/form-validation/` — not Zod.

---

## 7. Add tests

Co-locate `index.test.tsx` next to the component.

Reference: `src/components/common/button/button.test.tsx`

```tsx
// src/components/common/my-component/index.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './index';

describe('MyComponent', () => {
  it('renders label', () => {
    render(<MyComponent label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MyComponent label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

Run: `npm test -- src/components/common/my-component/index.test.tsx`

---

## 8. Verify

Checklist:

- [ ] Folder is kebab-case under the correct `components/` subtree
- [ ] Props interface exported with explicit types (no `any`)
- [ ] `'use client'` only when hooks/events/browser APIs are needed
- [ ] Classes merged with `cn()`, variants use CVA where appropriate
- [ ] Common component added to `src/components/index.ts`
- [ ] Co-located test passes
- [ ] No shadcn/ui imports

```bash
npm test -- src/components/common/my-component/index.test.tsx
npm run format    # uses config/.prettierrc.json
npm run build
```

> CI does not run tests automatically on PR merge — verify locally. Coverage threshold is 70% when running `npm run test:coverage`.
