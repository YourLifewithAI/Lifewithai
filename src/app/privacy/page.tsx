import type { Metadata } from 'next';
import { Fragment } from 'react';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';
import { pageMeta } from '@/lib/meta';
import { html, list, slot, splitAt, words } from '@/lib/words';

export function generateMetadata(): Metadata {
  const w = words('privacy');
  return pageMeta({ title: slot(w, 'Title'), description: slot(w, 'Description'), path: '/privacy' });
}

// Its words are in words/privacy.md. Each "## " heading there, with its {#name}, becomes one section of the page.
export default function PrivacyPage() {
  const w = words('privacy');
  const button = <AnalyticsSettingsButton className="btn" label={slot(words('site'), 'Analytics preferences button')} />;
  // the contents list: "- [Words](#name)" lines
  const toc = list(w, 'Contents').map((item) => {
    const m = /^\[(.+)\]\((.+)\)$/.exec(item);
    if (!m) throw new Error(`words/privacy.md, "# Contents": "${item}" should read - [Words](#name)`);
    return { text: m[1], href: m[2] };
  });
  const sections = html(slot(w, 'Page'))
    .split(/(?=<h2 id=")/)
    .filter((s) => s.trim())
    .map((s) => ({ id: /^<h2 id="([^"]+)">/.exec(s)?.[1], parts: splitAt(s.replace(/^<h2 id="[^"]+">/, '<h2>'), 'analytics settings button') }));
  return (
    <div className="sheet">
      <div className="sheet-body">
        <div className="page-head stack">
          <h1>{slot(w, 'Title')}</h1>
          <p className="lead">{slot(w, 'Lead')}</p>
          <div className="btnrow">{button}</div>
        </div>
        <nav className="toc" aria-label={slot(w, 'Contents, for screen readers')}>
          {toc.map((t) => (
            <a key={t.href} href={t.href}>
              {t.text}
            </a>
          ))}
        </nav>
        <p className="small muted">{slot(w, 'Updated')}</p>
        <article className="doc" aria-label={slot(w, 'The page, for screen readers')}>
          {sections.map(({ id, parts }, i) => (
            <section key={id ?? i} id={id} className="doc">
              {parts.map((h, k) => (
                <Fragment key={k}>
                  {k > 0 && <div className="btnrow">{button}</div>}
                  <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: h }} />
                </Fragment>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
