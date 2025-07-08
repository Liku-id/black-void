import type { Metadata } from 'next';
import AuthLayout from '@/components/layout/auth-layout';

export const metadata: Metadata = {
  title: 'Login | Wukong - Beli Tiket Konser, Event, dan Hiburan',
  description:
    'Masuk ke akun Wukong untuk membeli tiket konser, stand-up comedy, meet & greet, dan berbagai event seru lainnya. Kelola pembelian dan lihat histori tiket Anda.',
  keywords:
    'wukong, login, tiket konser, beli tiket event, tiket standup comedy, tiket meet and greet, sistem tiket online',
};

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AuthLayout>{children}</AuthLayout>
    </main>
  );
}
