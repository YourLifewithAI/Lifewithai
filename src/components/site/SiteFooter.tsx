import Link from 'next/link';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';
import { SITE, SOCIAL } from '@/lib/site';
import { slot, words } from '@/lib/words';

export default function SiteFooter() {
  const w = words('site');
  return (
    <footer className="foot">
      <p>{SITE.host}</p>
      <p>
        <a href={`mailto:${SITE.contact}`} className="addr">
          {SITE.contact}
        </a>
      </p>
      <nav aria-label={slot(w, 'Footer: site links, for screen readers')} className="foot-links">
        <Link href="/about">{slot(w, 'Footer: about link')}</Link>
        <Link href="/privacy">{slot(w, 'Footer: privacy link')}</Link>
        <AnalyticsSettingsButton className="foot-btn" label={slot(w, 'Analytics preferences button')} />
      </nav>
      <nav aria-label={slot(w, 'Footer: links elsewhere, for screen readers')} className="foot-links">
        {SOCIAL.map((s) => (
          <a key={s.href} href={s.href} rel={s.me ? 'me noopener noreferrer' : 'noopener noreferrer'}>
            {s.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
