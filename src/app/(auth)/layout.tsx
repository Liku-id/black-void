import type { Metadata } from 'next';
import AuthLayout from '@/components/layout/auth-layout';
import AuthHeader from '@/components/layout/auth-header';

export const metadata: Metadata = {
  title: 'Login | Wukong - Buy Concert Tickets, Events, and Entertainment',
  description:
    'Log in to your Wukong account to purchase concert tickets, stand-up comedy shows, meet & greets, and other exciting events. Manage your purchases and view your ticket history.',
  keywords:
    'wukong, login, concert tickets, buy event tickets, standup comedy tickets, meet and greet tickets, online ticketing system',
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
