# Black Void

Modern React/Next.js project with Tailwind CSS and shadcn/ui components.

## Quick Start

### Prerequisites
- Node.js 20+
- npm

### Install & Run
```bash
# Clone & install (use --legacy-peer-deps for React 19)
git clone <repository-url>
cd black-void
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

## Scripts
- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run format` - Format code
- `npm run lint` - Run ESLint

## Testing
```bash
npm test                    # Run tests
npm test -- --coverage     # With coverage
```

**Coverage:** 92.3% statements, 94.57% lines

## Troubleshooting

**Install fails?** Use `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

**Node.js too old?** Upgrade to v20+:
```bash
nvm install 20 && nvm use 20
```

**Tests fail?** Install react-hook-form:
```bash
npm install react-hook-form --legacy-peer-deps
```

## Tech Stack
- React 19 + Next.js 15
- Tailwind CSS + shadcn/ui
- Three.js for 3D graphics
- Jest + Testing Library
- TypeScript

## Project Structure
```
src/
├── app/                 # Next.js pages
├── components/          # React components
│   ├── common/         # Reusable components
│   ├── layout/         # Layout components
│   ├── ui/             # shadcn/ui components
│   └── visuals/        # Three.js components
├── lib/                # Utilities
└── assets/             # Static files
```

## Notes
- React 19 may have compatibility issues with some libraries
- Always use `--legacy-peer-deps` when installing new packages
- Use `npm run format` for consistent code formatting
