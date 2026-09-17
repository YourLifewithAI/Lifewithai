import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';
import './privacy.css';

export const metadata: Metadata = {
  title: 'Analytics and privacy',
  description: 'Your choices about Google Analytics, and how Life with AI measures site activity.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="city privacy-page" id="reader-content">
      <section className="privacy-hero" aria-labelledby="privacy-title">
        <Image src="/images/arcology/robot-garden-privacy-v1.webp" alt=""
          fill priority sizes="100vw" className="privacy-art" />
        <div className="privacy-introduction">
          <Link href="/" className="privacy-return">Back to the Arcology</Link>
          <h1 id="privacy-title">A little space<br />for your privacy.</h1>
          <p>Explore at your own pace. Google Analytics is optional, and your choice won’t change what you can read here.</p>
          <AnalyticsSettingsButton className="city-button privacy-preferences" />
        </div>
      </section>
      <div className="privacy-body">
        <aside className="privacy-contents" aria-label="On this page">
          <p>Analytics and privacy</p>
          <nav>
            <a href="#your-choice">Your choice</a>
            <a href="#google-analytics">What Google Analytics measures</a>
            <a href="#other-services">Other site services</a>
            <a href="#substack">Following a story to Substack</a>
          </nav>
          <p className="privacy-updated">Updated September 17, 2026</p>
        </aside>
        <article className="privacy-copy" aria-label="Analytics and privacy details">
          <section id="your-choice">
            <h2>Your choice, whenever you visit.</h2>
            <p>We use analytics to understand which stories and places readers visit, how they find Life with AI, and which links they follow.</p>
            <p><strong>The Google Analytics tag loads only after you accept analytics cookies.</strong> Decline and you can continue exploring the whole site. You can reopen your preferences here or in the footer at any time.</p>
            <p>Your choice is saved in this browser for 180 days. A different browser or device has its own choice. Clearing browser storage may ask you to choose again.</p>
            <p>If you change your choice to decline, we stop further Google Analytics collection and clear this site’s Google Analytics cookies. If the tag was running, the page reloads to remove it. This does not erase data Google has already received.</p>
            <AnalyticsSettingsButton className="city-button privacy-preferences" />
          </section>
          <section id="google-analytics">
            <h2>What Google Analytics measures.</h2>
            <p>After you accept, Google Analytics 4 uses cookies and similar identifiers to measure page visits, reading engagement, scrolling, outbound clicks, supported downloads and video interactions. Reports can also include how you arrived, approximate location, and device and browser information.</p>
            <p>Google receives activity data to provide these reports. Our integration disables advertising personalization and Google Signals. We do not send names, email addresses, chat messages or form contents as custom events.</p>
            <p>The 180-day preference period describes your browser choice; it is not a promise that all reporting data is deleted after 180 days. Google’s processing and retention are described in its policies.</p>
            <p>Read <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a> and <a href="https://policies.google.com/privacy">Google’s privacy policy</a>.</p>
          </section>
          <section id="other-services">
            <h2>Other site services.</h2>
            <p>Your Google Analytics preference controls Google Analytics specifically. The site also uses Plausible for traffic reporting, and Netlify hosts the website and records requests for operation and traffic reporting. Declining Google Analytics does not disable these services.</p>
            <p>See <a href="https://plausible.io/data-policy">Plausible’s data policy</a> and <a href="https://www.netlify.com/privacy/">Netlify’s privacy policy</a> for their practices.</p>
          </section>
          <section id="substack">
            <h2>Following a story to Substack.</h2>
            <p>Substack is a separate service with its own privacy practices. If you accept Google Analytics, we can measure a click to the author’s Substack. A click does not tell us whether you subscribed.</p>
            <p>See <a href="https://substack.com/privacy">Substack’s privacy policy</a>.</p>
          </section>
          <p className="privacy-end"><Link href="/">Return to the city</Link></p>
        </article>
      </div>
    </div>
  );
}
