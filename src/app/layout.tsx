import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Life with AI',
    template: '%s | Life with AI',
  },
  description: 'Speculative fiction and collaborative engineering for human-AI futures.',
  metadataBase: new URL('https://lifewithai.ai'),
  openGraph: {
    title: 'Life with AI',
    description: 'Speculative fiction and collaborative engineering for human-AI futures.',
    url: 'https://lifewithai.ai',
    siteName: 'Life with AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1792,
        height: 1024,
        alt: 'Life with AI — speculative fiction and engineering for human-AI futures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life with AI',
    description: 'Speculative fiction and collaborative engineering for human-AI futures.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://lifewithai.ai/api/v1/podcast/feed',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src="https://plausible.io/js/pa-sEx2qqgf1J4O5wgebsjES.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
