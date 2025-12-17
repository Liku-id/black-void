import type { Metadata } from 'next';
import { SEO_CONFIG } from '@/config/seo';

export const metadata: Metadata = SEO_CONFIG.pages.becomeCreator;

export default function BecomeCreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
