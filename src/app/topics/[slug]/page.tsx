import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Strip from '@/components/site/Strip';
import PieceCard from '@/components/site/PieceCard';
import { TopicIcon } from '@/components/site/TopicIcons';
import { SITE } from '@/lib/site';
import { pageMeta } from '@/lib/meta';
import { TOPIC_IDS } from '@/lib/topics';
import { topicById } from '@/lib/topic-words';
import { pieces, interviewsFor, benchFor } from '@/lib/pieces';
import { slot, words } from '@/lib/words';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPIC_IDS.map((id) => ({ slug: id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = topicById((await params).slug);
  if (!topic) return {};
  return pageMeta({ title: topic.verb, description: topic.about[0], path: `/topics/${topic.id}` });
}

// A topic's own words are in words/topics/<id>.md; the words every topic page shares are in words/topic-page.md.
export default async function TopicPage({ params }: Props) {
  const topic = topicById((await params).slug);
  if (!topic) notFound();
  const w = words('topic-page');
  const mine = interviewsFor(topic.id);
  const bench = benchFor(topic.id);
  const all = pieces();
  const numberOf = (id: string) => all.findIndex((p) => p.id === id) + 1;

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
            <p>{slot(w, 'The AI line')}</p>
          </div>
        </div>
        <div className="tb">
          <div>
            <b>{slot(w, 'Table: topic')}</b>
            <span>{topic.verb}</span>
          </div>
          <div>
            <b>{slot(w, 'Table: covers')}</b>
            <span>{topic.covers}</span>
          </div>
          <div>
            <b>{slot(w, 'Table: interviews')}</b>
            <span className="num">{mine.length}</span>
          </div>
          <div>
            <b>{slot(w, 'Table: status')}</b>
            <span>{mine.length ? slot(w, 'Status: with interviews') : slot(w, 'Status: no interviews yet')}</span>
          </div>
        </div>
      </div>

      <section className="block" aria-labelledby="now-h">
        <h2 className="sec" id="now-h">
          {slot(w, 'What is here now')}
        </h2>
        {mine.length ? (
          <ul className={`cards${mine.length === 1 ? ' one' : ''}`} aria-labelledby="now-h">
            {mine.map((p) => (
              <PieceCard key={p.id} piece={p} n={numberOf(p.id)} total={all.length} />
            ))}
          </ul>
        ) : (
          <p className="copy">{slot(w, 'No interviews yet')}</p>
        )}
        {bench.length ? (
          <>
            <h3 className="sec sec-s">{slot(w, 'From the bench')}</h3>
            <ul className={`cards${bench.length === 1 ? ' one' : ''}`}>
              {bench.map((p) => (
                <PieceCard key={p.id} piece={p} n={numberOf(p.id)} total={all.length} />
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
