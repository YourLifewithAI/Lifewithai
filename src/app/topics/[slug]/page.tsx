import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Strip from '@/components/site/Strip';
import PieceCard from '@/components/site/PieceCard';
import { TopicIcon } from '@/components/site/TopicIcons';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/meta';
import { TOPICS, topicById } from '@/lib/topics';
import { PIECES, interviewsFor, benchFor } from '@/lib/pieces';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = topicById((await params).slug);
  if (!topic) return {};
  return pageMeta({ title: topic.verb, description: topic.about[0], path: `/topics/${topic.id}` });
}

export default async function TopicPage({ params }: Props) {
  const topic = topicById((await params).slug);
  if (!topic) notFound();
  const mine = interviewsFor(topic.id);
  const bench = benchFor(topic.id);

  return (
    <>
      <div className="sheet">
        <div className="sheet-body">
          <div className="topic-head">
            <TopicIcon id={topic.id} dashed={mine.length === 0} />
            <div>
              <h1>{topic.verb}</h1>
              <p className="gloss-line">{topic.gloss}</p>
            </div>
          </div>
          <div className="copy stack">
            {topic.about.map((s) => (
              <p key={s}>{s}</p>
            ))}
            <p>
              The AI here is not a chatbot on a screen. It is in the work: in a tool, a machine or a sensor.
            </p>
          </div>
        </div>
        <div className="tb">
          <div>
            <b>Topic</b>
            <span>{topic.verb}</span>
          </div>
          <div>
            <b>Covers</b>
            <span>{topic.covers}</span>
          </div>
          <div>
            <b>Interviews</b>
            <span className="num">{mine.length}</span>
          </div>
          <div>
            <b>Status</b>
            <span>{mine.length ? 'Open for more' : 'Open plot'}</span>
          </div>
        </div>
      </div>

      <section className="block" aria-labelledby="now-h">
        <h2 className="sec" id="now-h">
          What is here now
        </h2>
        {mine.length ? (
          <ul className={`cards${mine.length === 1 ? ' one' : ''}`} aria-labelledby="now-h">
            {mine.map((p) => (
              <PieceCard key={p.id} piece={p} n={PIECES.indexOf(p) + 1} total={PIECES.length} />
            ))}
          </ul>
        ) : (
          <p className="copy">No interviews yet. This topic is an open plot.</p>
        )}
        {bench.length ? (
          <>
            <h3 className="sec sec-s">From Ben&apos;s bench</h3>
            <ul className={`cards${bench.length === 1 ? ' one' : ''}`}>
              {bench.map((p) => (
                <PieceCard key={p.id} piece={p} n={PIECES.indexOf(p) + 1} total={PIECES.length} />
              ))}
            </ul>
          </>
        ) : null}
        <div className="wanted">
          <p>
            <b>{SITE.invite}</b> {topic.ask}
          </p>
          <p>
            <a className="addr" href={`mailto:${SITE.contact}`}>
              {SITE.contact}
            </a>
          </p>
        </div>
      </section>

      <div className="sheet">
        <Strip current={topic.id} headingId="topics-all-h" />
      </div>
    </>
  );
}
