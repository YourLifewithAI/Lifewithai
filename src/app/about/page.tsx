import type { Metadata } from 'next';
import { Fragment } from 'react';
import { SITE, stages } from '@/lib/site';
import { pageMeta } from '@/lib/meta';
import { html, slot, splitAt, words } from '@/lib/words';

export function generateMetadata(): Metadata {
  const w = words('about');
  return pageMeta({ title: slot(w, 'Title'), description: slot(w, 'Description'), path: '/about' });
}

// Its words are in words/about.md; the opening line and the stages are in words/site.md.
export default function AboutPage() {
  const w = words('about');
  // the contact address keeps the site's address style
  const page = html(slot(w, 'Page')).replace(/<a href="mailto:/g, '<a class="addr" href="mailto:');
  const [before, ...after] = splitAt(page, 'stages');
  return (
    <div className="sheet">
      <div className="sheet-body">
        <div className="page-head">
          <h1>{slot(w, 'Title')}</h1>
        </div>
        <div className="doc">
          <p className="lead">{SITE.sub}</p>
          <Html html={before} />
          {after.map((h, i) => (
            <Fragment key={i}>
              <dl>
                {stages().map((s) => (
                  <Fragment key={s.id}>
                    <dt>{s.label}</dt>
                    <dd>{s.means}</dd>
                  </Fragment>
                ))}
              </dl>
              <Html html={h} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// The page's own HTML, made from Ben's Markdown, laid straight into the page's column (no extra box around it).
function Html({ html }: { html: string }) {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
