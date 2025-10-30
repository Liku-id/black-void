import type { Metadata } from 'next';
import { Bebas_Neue, Onest } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';
import '../styles/animations.css';
import SWRProvider from '@/lib/api/swr-provider';
import { PostHogProvider } from '@/lib/posthog';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wukong',
  description:
    'Wukong - Advanced ticketing management system for seamless event organization and ticket sales.',
  icons: {
    icon: [
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        url: '/favicon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
  const metaId = process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || '';

  return (
    <html lang="en">
      <head>
        {/* Facebook Domain Verification */}
        {metaId && (
          <meta
            name="facebook-domain-verification"
            content={metaId}
          />
        )}
      </head>
      <body className={`antialiased ${bebasNeue.variable} ${onest.variable}`}>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>


        <PostHogProvider>
          <SWRProvider>{children}</SWRProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
