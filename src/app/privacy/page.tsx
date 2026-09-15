import type { Metadata } from 'next';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: 'Analytics and privacy',
  description: 'How Life with AI measures site activity and how to manage your analytics preferences.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-white sm:text-4xl">Analytics and privacy</h1>
      <div className="prose max-w-none">
        <p>We use site analytics to understand which stories and places people visit,
          how they find Life with AI, and which links they follow.</p>
        <h2>Optional Google Analytics</h2>
        <p>Google Analytics loads only after you accept analytics cookies. It measures page
          visits, approximate location, device and browser information, engagement, scrolling,
          and outbound links, including clicks to Substack. Google processes this information
          to provide our reports. We do not enable advertising personalization or Google Signals,
          and we do not send names, email addresses, chat messages, or form contents as custom events.</p>
        <p>You can decline and continue using the site. We remember your choice in this browser
          for 180 days. You can change it below; declining stops further Google Analytics collection
          and clears this site's Google Analytics cookies. Changing your choice does not erase
          information already collected.</p>
        <p><AnalyticsSettingsButton className="cursor-pointer text-accent underline underline-offset-2" /></p>
        <p>Learn more about <a href="https://policies.google.com/technologies/partner-sites">how Google
          uses information from sites that use its services</a> and
          {' '}<a href="https://policies.google.com/privacy">Google's privacy policy</a>.</p>
        <h2>Other site activity</h2>
        <p>The site also includes Plausible analytics and is hosted by Netlify, which records
          requests for site operation and traffic reporting. Your Google Analytics choice
          applies specifically to Google Analytics.
          See <a href="https://plausible.io/data-policy">Plausible's data policy</a> and
          {' '}<a href="https://www.netlify.com/privacy/">Netlify's privacy policy</a>.</p>
        <h2>Links to Substack</h2>
        <p>Following a Substack link takes you to a separate service with its own privacy practices.
          We can measure that a link was clicked when analytics is accepted; that does not tell us
          whether you subscribed on Substack.</p>
      </div>
    </div>
  );
}
