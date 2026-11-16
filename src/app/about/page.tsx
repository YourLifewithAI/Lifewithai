import type { Metadata } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import { SITE, stages } from '@/lib/site';
import { pageMeta } from '@/lib/meta';
import { html, slot, splitAt, words } from '@/lib/words';
import benDesk from '@/content/photos/ben-desk.jpg';

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
  // Ben's photo sits beside the Who section (Ben, 2026-11-15): the opening line, the section's heading and its words on
  // the left, the photo on the right, so the two end about level. If the {#who} heading is ever gone, the page shows as
  // before, without the photo.
  const who = section(before, 'who');
  return (
    <div className="sheet">
      <div className="sheet-body">
        <div className="page-head">
          <h1>{slot(w, 'Title')}</h1>
        </div>
        <div className="doc">
          {who ? (
            <>
              <div className="about-who">
                <p className="lead">{SITE.sub}</p>
                <div className="about-who-words">
                  <Html html={who[0]} />
                  <Html html={who[1]} />
                </div>
                <figure className="photo about-who-photo">
                  <Image
                    src={benDesk}
                    alt={slot(w, 'Photo of Ben, for screen readers')}
                    sizes="(min-width: 940px) 220px, (min-width: 600px) 144px, min(320px, calc(100vw - 72px))"
                    loading="eager"
                  />
                </figure>
              </div>
              <Html html={who[2]} />
            </>
          ) : (
            <>
              <p className="lead">{SITE.sub}</p>
              <Html html={before} />
            </>
          )}
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

// A section of the page's HTML: [what comes before its heading, the heading and its words, what comes after], or null
// when there is no heading with that id.
function section(page: string, id: string): [string, string, string] | null {
  const start = page.indexOf(`<h2 id="${id}"`);
  if (start < 0) return null;
  const end = page.indexOf('<h2', start + 1);
  return end < 0 ? [page.slice(0, start), page.slice(start), ''] : [page.slice(0, start), page.slice(start, end), page.slice(end)];
}

// The page's own HTML, made from Ben's Markdown, laid straight into the page's column (no extra box around it).
function Html({ html }: { html: string }) {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
