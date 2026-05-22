import type { Metadata } from 'next';
import AuthLayout from '@/components/layout/auth-layout';
import AuthHeader from '@/components/layout/header/mobile';

export const metadata: Metadata = {
  title: 'Get in | Wukong - Buy Concert Tickets, Events, and Entertainment',
  description:
    'Get in to your Wukong account to purchase concert tickets, stand-up comedy shows, meet & greets, and other exciting events. Manage your purchases and view your ticket history.',
  keywords:
    'wukong, Get in, concert tickets, buy event tickets, standup comedy tickets, meet and greet tickets, online ticketing system',
};

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AuthHeader />
      <AuthLayout>{children}</AuthLayout>
    </main>
  );
}
