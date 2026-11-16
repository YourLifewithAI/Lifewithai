import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Strip from '@/components/site/Strip';
import ThemeToggle from '@/components/site/ThemeToggle';
import { themeWords } from '@/components/site/SiteHeader';
import asherFront from '@/content/photos/asher-front.jpg';
import { SITE, stageLabel } from '@/lib/site';
import { spotlight } from '@/lib/pieces';
import { pageMeta } from '@/lib/meta';
import { slot, words } from '@/lib/words';

export function generateMetadata(): Metadata {
  return pageMeta({ description: SITE.description, path: '/' });
}

// Front page order (Ben, 2026-11-15): the name, then the innovator spotlight, then the topics.
// Its words are in words/home.md and words/site.md.
export default function Home() {
  const w = words('home');
  const spot = spotlight();
  const isBench = spot.kind === 'bench';

  return (
    <>
      <div className="sheet cover">
        <div className="mast">
          <h1>{SITE.name}</h1>
          <p className="mast-line">{SITE.line}</p>
          <a className="btn" href="#signup">
            {slot(words('site'), 'Subscribe button')}
          </a>
          <ThemeToggle words={themeWords()} />
          <p className="mast-tag">{SITE.tagline}</p>
        </div>
      </div>

      {/* The innovator spotlight: the first thing a reader sees */}
      <section className="block" aria-labelledby="spot-h">
        <h2 className="sec" id="spot-h">
          {slot(w, 'Spotlight heading')}
        </h2>
        <div className="sheet spot">
          <div className="spot-grid">
            {/* A photo of Asher as built, in place of the plan drawing (Ben, 2026-11-15: "a proof that I've actually
                built it"). The drawing, AsherPlan.tsx, stays in the code. sizes: the figure is the full sheet width on
                a phone, and the left of two columns from 900 px, at most 450 px. */}
            <figure className="photo">
              <Image
                src={asherFront}
                alt={slot(w, 'Spotlight photo, for screen readers')}
                sizes="(min-width: 1112px) 450px, (min-width: 900px) calc((100vw - 122px) / 2.2), calc(100vw - 83px)"
                loading="eager"
                fetchPriority="high"
              />
              <figcaption>{slot(w, 'Spotlight photo: caption')}</figcaption>
            </figure>
            <div className="spot-words">
              <p className="form">{spot.form}</p>
              <h3 className="sheet-title">{spot.title}</h3>
              <p className="who">{spot.who}</p>
              <p className="copy">
                {spot.hook} {slot(w, 'Spotlight: more about the build')}
              </p>
              <div className="btnrow">
                <Link className="btn primary" href={spot.href}>
                  {slot(w, 'Spotlight button')}
                </Link>
              </div>
            </div>
            {/* The main parts, under the photo on a wide screen and after the words on a phone (Ben, 2026-11-15: no
                empty space under the photo; a heading says what the boxes are) */}
            <div className="spot-basics">
              <h4 id="spot-basics-h">{slot(w, 'Spotlight: main parts heading')}</h4>
              <ul className="chips" aria-labelledby="spot-basics-h">
                {spot.receipt.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tb">
            <div>
              <b>{slot(w, 'Spotlight table: kind')}</b>
              <span>{spot.form}</span>
            </div>
            <div>
              <b>{slot(w, 'Spotlight table: topic')}</b>
              <span>{spot.topicLabel}</span>
            </div>
            <div>
              <b>{slot(w, 'Spotlight table: stage')}</b>
              <span>{stageLabel(spot.stage)}</span>
            </div>
            <div>
              <b>{slot(w, 'Spotlight table: status')}</b>
              <span>{isBench ? slot(w, 'Spotlight status: Ben’s own build') : slot(w, 'Spotlight status: an interview')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The topics: every one starts as an open plot */}
      <section className="block" id="open" aria-label={slot(w, 'Topics heading')}>
        <div className="sheet">
          <Strip intro={SITE.sub} />
        </div>
        <div className="wanted">
          <p>
            <b>{SITE.invite}</b> {slot(w, 'Under the topics')}
          </p>
          <p>
            <a className="addr" href={`mailto:${SITE.contact}`}>
              {SITE.contact}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
