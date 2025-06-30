# Wukong - Ticketing Management System

Wukong is an advanced ticketing management system for seamless event organization and ticket sales. Streamline your events with our powerful platform.

## Features
- Modern Coming Soon landing page
- Animated Three.js background
- Responsive header with logo
- Countdown timer to launch
- Email notification form (integrated with Google Sheets)
- Font: Bebas Neue (headline), Onest (descriptive)

## Folder Structure
```
black-void/
├── public/
│   └── ... (static assets)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── assets/
│   │   └── logo/
│   │       └── logo.svg
│   ├── components/
│   │   ├── Header.tsx
│   │   └── ThreeBackground.tsx
│   └── lib/
│       └── utils.ts
├── package.json
├── README.md
└── ... (config & other files)
```

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Three.js
- Google Apps Script (for email storage)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Liku-id/black-void.git
cd black-void
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```

### 4. Deploy to Vercel
- Push to GitHub
- Import project on [vercel.com](https://vercel.com)
- Follow the deploy instructions

## Email Notification Integration
- Email addresses submitted via the form are sent to a Google Apps Script endpoint and stored in a Google Sheet.
- Update the endpoint in `src/app/page.tsx` if you want to use your own Google Apps Script.

## License
MIT
