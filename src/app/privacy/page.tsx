import type { Metadata } from 'next';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/meta';

export const metadata: Metadata = pageMeta({
  title: 'Analytics and privacy',
  description: 'Your choices about Google Analytics, what the sign-up form keeps, and how Life with AI measures site activity.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="sheet">
      <div className="sheet-body">
        <div className="page-head stack">
          <h1>Analytics and privacy</h1>
          <p className="lead">
            Explore at your own pace. Google Analytics is optional, and your choice won&apos;t change what you can
            read here.
          </p>
          <div className="btnrow">
            <AnalyticsSettingsButton className="btn" />
          </div>
        </div>
        <nav className="toc" aria-label="On this page">
          <a href="#your-choice">Your choice</a>
          <a href="#google-analytics">What Google Analytics measures</a>
          <a href="#other-services">Other site services</a>
          <a href="#signup-data">The sign-up form</a>
          <a href="#substack">Following a link to Substack</a>
          <a href="#contact">Questions</a>
        </nav>
        <p className="small muted">Updated November 15, 2026</p>
        <article className="doc" aria-label="Analytics and privacy details">
          <section id="your-choice" className="doc">
            <h2>Your choice, whenever you visit.</h2>
            <p>
              We use analytics to understand which pages readers visit, how they find Life with AI, and which links
              they follow.
            </p>
            <p>
              <strong>The Google Analytics tag loads only after you accept analytics cookies.</strong> Decline and
              you can continue exploring the whole site. You can reopen your preferences here or in the footer at
              any time.
            </p>
            <p>
              Your choice is saved in this browser for 180 days. A different browser or device has its own choice.
              Clearing browser storage may ask you to choose again.
            </p>
            <p>
              If you change your choice to decline, we stop further Google Analytics collection and clear this
              site&apos;s Google Analytics cookies. If the tag was running, the page reloads to remove it. This does
              not erase data Google has already received.
            </p>
            <div className="btnrow">
              <AnalyticsSettingsButton className="btn" />
            </div>
          </section>
          <section id="google-analytics" className="doc">
            <h2>What Google Analytics measures.</h2>
            <p>
              After you accept, Google Analytics 4 uses cookies and similar identifiers to measure page visits,
              reading engagement, scrolling, outbound clicks, supported downloads and video interactions. Reports
              can also include how you arrived, approximate location, and device and browser information.
            </p>
            <p>
              Google receives activity data to provide these reports. Our integration disables advertising
              personalization and Google Signals. We do not send names, email addresses or form contents as custom
              events.
            </p>
            <p>
              The 180-day preference period describes your browser choice; it is not a promise that all reporting
              data is deleted after 180 days. Google&apos;s processing and retention are described in its policies.
            </p>
            <p>
              Read{' '}
              <a href="https://policies.google.com/technologies/partner-sites">
                how Google uses information from sites that use its services
              </a>{' '}
              and <a href="https://policies.google.com/privacy">Google&apos;s privacy policy</a>.
            </p>
          </section>
          <section id="other-services" className="doc">
            <h2>Other site services.</h2>
            <p>
              Your Google Analytics preference controls Google Analytics specifically. Netlify hosts the website and
              records requests for operation and traffic reporting. Declining Google Analytics does not turn that off.
            </p>
            <p>
              See <a href="https://www.netlify.com/privacy/">Netlify&apos;s privacy policy</a> for its practices.
            </p>
          </section>
          <section id="signup-data" className="doc">
            <h2>The sign-up form.</h2>
            <p>If you sign up for new pieces by email, we keep:</p>
            <ul>
              <li>your email address;</li>
              <li>the topics you ticked, if any;</li>
              <li>which page you first signed up from;</li>
              <li>the date and time you signed up, and the last time you sent the form again.</li>
            </ul>
            <p>
              We keep them in Netlify&apos;s storage for this site until you ask to be taken off the list. We use your address only to send you new
              pieces. We do not sell it or share it, and we do not send it to Google Analytics.
            </p>
            <p>
              To be taken off the list, or to see what we hold about you, write to{' '}
              <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a> and we will do it.
            </p>
          </section>
          <section id="substack" className="doc">
            <h2>Following a link to Substack.</h2>
            <p>
              Substack is a separate service with its own privacy practices. If you accept Google Analytics, we can
              measure a click to the author&apos;s Substack. A click does not tell us whether you subscribed.
            </p>
            <p>
              See <a href="https://substack.com/privacy">Substack&apos;s privacy policy</a>.
            </p>
          </section>
          <section id="contact" className="doc">
            <h2>Questions about your privacy.</h2>
            <p>
              Write to <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a> with any question about this page or
              what the site measures.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
