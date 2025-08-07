import type { Metadata } from 'next';
import Image from 'next/image';
import logo from '@/assets/logo/white-logo.svg';

export const metadata: Metadata = {
  title: 'Scanner | Wukong - Buy Concert Tickets, Events, and Entertainment',
  description:
    'Scan tickets for concerts, stand-up comedy shows, meet & greets, and other events with Wukong. Manage your ticketing needs seamlessly.',
  keywords:
    'wukong, scanner, ticket scanner, concert tickets, event tickets, standup comedy tickets, meet and greet tickets, online ticketing system',
};

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Image
        src={logo}
        alt="Logo"
        height={32}
        width={120}
        className="absolute top-6 left-6 z-50 h-8 w-auto"
        priority
      />
      {children}
    </main>
  );
}
