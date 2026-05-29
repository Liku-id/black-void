import { createLocalizedMetadata } from '@/config/seo';
import { setRequestLocale } from 'next-intl/server';

export const generateMetadata = createLocalizedMetadata(
  'becomeCreator',
  'metadata.become_creator'
);

export default async function BecomeCreatorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
