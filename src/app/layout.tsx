import type { Metadata, Viewport } from 'next';
import { Jost, Public_Sans } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import HeaderGate from '@/components/site/HeaderGate';
import SignupForm from '@/components/site/SignupForm';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';
import { TopicSprite } from '@/components/site/TopicIcons';
import { SITE } from '@/lib/site';
import { topics } from '@/lib/topic-words';
import { inline, slot, words } from '@/lib/words';
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

export function generateMetadata(): Metadata {
  return {
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
}

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
  // The sign-up form and the analytics banner run in the browser, so their words go to them as props.
  const w = words('site');
  return (
    <html lang="en">
      <body className={`${jost.variable} ${publicSans.variable}`}>
        <a className="skip" href="#main">
          {slot(w, 'Skip link')}
        </a>
        <TopicSprite />
        <HeaderGate>
          <SiteHeader />
        </HeaderGate>
        <div className="wrap">
          <main id="main" className="view" tabIndex={-1}>
            {children}
          </main>
          <SignupForm
            topics={topics().map((t) => ({ id: t.id, verb: t.verb }))}
            words={{
              heading: slot(w, 'Sign-up heading'),
              emailLabel: slot(w, 'Sign-up: email label'),
              topicsLabel: slot(w, 'Sign-up: topics label'),
              trapLabel: slot(w, 'Sign-up: hidden field'),
              consentHtml: inline(slot(w, 'Sign-up: what we do with the address')),
              button: slot(w, 'Sign-up button'),
              sending: slot(w, 'Sign-up: sending'),
              thanks: slot(w, 'Sign-up: thank you'),
              badEmail: slot(w, 'Sign-up: address looks wrong'),
              failed: slot(w, 'Sign-up: did not go through'),
            }}
          />
          <SiteFooter />
        </div>
        <GoogleAnalytics
          words={{
            label: slot(w, 'Analytics preferences button'),
            heading: slot(w, 'Analytics banner: heading'),
            text: slot(w, 'Analytics banner: text'),
            link: slot(w, 'Analytics banner: link'),
            preview: slot(w, 'Analytics banner: on a preview'),
            decline: slot(w, 'Analytics banner: decline'),
            accept: slot(w, 'Analytics banner: accept'),
          }}
        />
      </body>
    </html>
  );
}
