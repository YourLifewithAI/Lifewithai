import type { Metadata } from 'next';
import Link from 'next/link';
import Strip from '@/components/site/Strip';
import AsherPlan from '@/components/site/AsherPlan';
import { SITE, stageLabel } from '@/lib/site';
import { topicById } from '@/lib/topic-words';
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
  const spotTopic = topicById(spot.topic);
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
            <figure className="photo">
              <div className="fig">
                <AsherPlan
                  words={{
                    label: slot(w, 'Spotlight drawing, for screen readers'),
                    powerBank: slot(w, 'Spotlight drawing: power bank'),
                    computer: slot(w, 'Spotlight drawing: computer'),
                    webcam: slot(w, 'Spotlight drawing: webcam'),
                    sensor: slot(w, 'Spotlight drawing: distance sensor'),
                    wheel: slot(w, 'Spotlight drawing: mecanum wheel'),
                    front: slot(w, 'Spotlight drawing: front'),
                    note: slot(w, 'Spotlight drawing: note'),
                  }}
                />
              </div>
              <figcaption>{slot(w, 'Spotlight: drawing caption')}</figcaption>
            </figure>
            <div className="spot-words">
              <p className="form">{spot.form}</p>
              <h3 className="sheet-title">{spot.title}</h3>
              <p className="who">{spot.who}</p>
              <p className="copy">
                {spot.hook} {slot(w, 'Spotlight: more about the build')}
              </p>
              <ul className="chips" aria-label={slot(w, 'Spotlight: main parts, for screen readers')}>
                {spot.receipt.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="btnrow">
                <Link className="btn primary" href={spot.href}>
                  {slot(w, 'Spotlight button')}
                </Link>
              </div>
              {isBench ? <p className="spot-next">{slot(w, 'Spotlight: what comes next')}</p> : null}
            </div>
          </div>
          <div className="tb">
            <div>
              <b>{slot(w, 'Spotlight table: kind')}</b>
              <span>{spot.form}</span>
            </div>
            <div>
              <b>{slot(w, 'Spotlight table: topic')}</b>
              <span>{spotTopic?.verb}</span>
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
