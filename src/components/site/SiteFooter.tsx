import Link from 'next/link';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';
import { SITE, SOCIAL } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="foot">
      <p>{SITE.host}</p>
      <p>
        <a href={`mailto:${SITE.contact}`} className="addr">
          {SITE.contact}
        </a>
      </p>
      <nav aria-label="Site" className="foot-links">
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <AnalyticsSettingsButton className="foot-btn" />
      </nav>
      <nav aria-label="Life with AI elsewhere" className="foot-links">
        {SOCIAL.map((s) => (
          <a key={s.href} href={s.href} rel={s.me ? 'me noopener noreferrer' : 'noopener noreferrer'}>
            {s.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
