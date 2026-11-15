import type { Metadata, Viewport } from 'next';
import { Jost, Public_Sans } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import HeaderGate from '@/components/site/HeaderGate';
import SignupForm from '@/components/site/SignupForm';
import SiteFooter from '@/components/site/SiteFooter';
import { TopicSprite } from '@/components/site/TopicIcons';
import { SITE } from '@/lib/site';
import './globals.css';

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name}: ${SITE.line.replace(/\.$/, '')}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  // Pages set their own share title, address and image through pageMeta (src/lib/meta.ts).
  openGraph: { siteName: SITE.name, locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E2E7F0' },
    { media: '(prefers-color-scheme: dark)', color: '#07192E' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${publicSans.variable}`}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <TopicSprite />
        <HeaderGate />
        <div className="wrap">
          <main id="main" className="view" tabIndex={-1}>
            {children}
          </main>
          <SignupForm />
          <SiteFooter />
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
