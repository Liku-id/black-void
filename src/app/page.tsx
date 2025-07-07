'use client';

import { Typography } from '@/components/common/Typography';
import { Header } from '@/components';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <Header />
      <div className="space-y-6 text-center">
        {/* Hero Heading */}
        <Typography as="h1" type="heading" size={64}>
          Hello World
        </Typography>

        {/* Subtitle */}
        <Typography type="body" size={24} color="text-white">
          Welcome to Black Void
        </Typography>

        {/* Body text */}
        <Typography type="body" size={16} color="text-white">
          Built with Next.js 15 & Tailwind CSS 4
        </Typography>

        {/* Caption */}
        <Typography type="body" size={12} color="text-white">
          This is a caption text
        </Typography>
      </div>
    </div>
  );
}
