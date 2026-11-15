import type { Metadata } from 'next';
import Link from 'next/link';
import Strip from '@/components/site/Strip';
import AsherPlan from '@/components/site/AsherPlan';
import { SITE, stageLabel } from '@/lib/site';
import { topicById } from '@/lib/topics';
import { spotlight } from '@/lib/pieces';
import { pageMeta } from '@/lib/meta';

export const metadata: Metadata = pageMeta({ description: SITE.description, path: '/' });

// Front page order (Ben, 2026-11-15): the name, then the innovator spotlight, then the topics.
export default function Home() {
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
            Subscribe
          </a>
          <p className="mast-tag">{SITE.tagline}</p>
        </div>
      </div>

      {/* The innovator spotlight: the first thing a reader sees */}
      <section className="block" aria-labelledby="spot-h">
        <h2 className="sec" id="spot-h">
          Innovator spotlight
        </h2>
        <div className="sheet spot">
          <div className="spot-grid">
            <figure className="photo">
              <div className="fig">
                <AsherPlan />
              </div>
              <figcaption>Asher from above: a sketch of the main parts.</figcaption>
            </figure>
            <div className="spot-words">
              <p className="form">{spot.form}</p>
              <h3 className="sheet-title">{spot.title}</h3>
              <p className="who">{spot.who}</p>
              <p className="copy">
                {spot.hook} It has a webcam with microphones and a speaker. Claude looks through the camera,
                listens, decides, and sends short moves.
              </p>
              <ul className="chips" aria-label="Main parts">
                {spot.receipt.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="btnrow">
                <Link className="btn primary" href={spot.href}>
                  See the build
                </Link>
              </div>
              {isBench ? (
                <p className="spot-next">
                  Next in this spot: the first guest builder, in their own words.
                </p>
              ) : null}
            </div>
          </div>
          <div className="tb">
            <div>
              <b>Kind</b>
              <span>{spot.form}</span>
            </div>
            <div>
              <b>Topic</b>
              <span>{spotTopic?.verb}</span>
            </div>
            <div>
              <b>Stage</b>
              <span>{stageLabel(spot.stage)}</span>
            </div>
            <div>
              <b>Status</b>
              <span>{isBench ? 'Real, Ben’s bench' : 'Interview'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The topics: every one starts as an open plot */}
      <section className="block" id="open" aria-label="Topics">
        <div className="sheet">
          <Strip intro={SITE.sub} />
        </div>
        <div className="wanted">
          <p>
            <b>{SITE.invite}</b> Every topic here is waiting for its first interview. Work that fits none of the
            six counts too.
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
