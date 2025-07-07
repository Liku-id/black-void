# Testing Guide

## Quick Start

```bash
npm test                    # Run all tests
npm test -- --coverage     # With coverage report
npm test -- --watch        # Watch mode
```

## Test Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Box/
│   │   │   ├── index.tsx
│   │   │   └── Box.test.tsx
│   │   └── Typography/
│   │       ├── index.tsx
│   │       └── Typography.test.tsx
│   └── layout/
│       └── Header/
│           ├── index.tsx
│           └── Header.test.tsx
└── lib/
    ├── utils.ts
    └── utils.test.ts
```

## Writing Tests

### Component Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click Me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click Me' })
    ).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing with React Hook Form

```tsx
import { renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';

test('form validation', () => {
  const { result } = renderHook(() => useForm());
  // Test form logic
});
```

## Mocking

### Next.js Components

```tsx
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));
```

## Coverage

Current coverage: **92.3%** statements, **94.57%** lines

### Coverage Targets

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

## Troubleshooting

**Tests fail with React Hook Form?**

```bash
npm install react-hook-form --legacy-peer-deps
```

**Three.js tests fail?**

- Ensure Three.js is properly mocked
- Check if WebGLRenderer and other classes are mocked

**Import errors?**

- Check if component exports are correct
- Verify import paths match file structure
