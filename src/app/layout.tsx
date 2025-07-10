import type { Metadata } from 'next';
import { Bebas_Neue, Onest } from 'next/font/google';
import '../styles/globals.css';
import '../styles/animations.css';

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
  return (
    <html lang="en">
      <body className={`antialiased ${bebasNeue.variable} ${onest.variable}`}>
        {children}
      </body>
    </html>
  );
}
