// The topic strip: six buildings and two open plots on one ground line, built as a title block.
// Every topic starts as an open plot (a dashed drawing). Its first interview fills it in.
import Link from 'next/link';
import { TOPICS, OPEN_PLOTS } from '@/lib/topics';
import { interviewsFor } from '@/lib/pieces';
import { TopicIcon } from './TopicIcons';

const countWords = (n: number) => (n === 0 ? 'Open' : n === 1 ? '1 interview' : `${n} interviews`);

export default function Strip({
  current,
  headingId = 'topics-h',
  intro,
}: {
  current?: string;
  headingId?: string;
  intro?: string;
}) {
  return (
    <div className="topics">
      <div className="topics-head">
        <h2 id={headingId}>Topics</h2>
      </div>
      {intro ? <p className="topics-intro">{intro}</p> : null}
      <ul className="strip" aria-labelledby={headingId}>
        {TOPICS.map((t) => {
          const n = interviewsFor(t.id).length;
          return (
            <li key={t.id}>
              <Link
                href={`/topics/${t.id}`}
                className={`cell ${n ? 'lit' : 'none'}`}
                aria-current={current === t.id ? 'page' : undefined}
              >
                <span className="art">
                  <TopicIcon id={t.id} />
                </span>
                <span className="plate">
                  <span className="flag" aria-hidden="true" />
                  <span className="verb">{t.verb}</span> <span className="gloss">{t.gloss}</span>{' '}
                  <span className="count">{countWords(n)}</span>
                </span>
              </Link>
            </li>
          );
        })}
        {Array.from({ length: OPEN_PLOTS }, (_, i) => (
          <li key={`open-${i}`}>
            <a href="/#open" className="cell open">
              <span className="art">
                <TopicIcon id="open" />
              </span>
              <span className="plate">
                <span className="flag" aria-hidden="true" />
                <span className="verb">Open plot</span>{' '}
                <span className="count">
                  <span className="vh">A topic we haven&apos;t named yet.</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="strip-key">
        <span className="key-flag" aria-hidden="true" />A dashed drawing is an open plot. It fills in, with a flag,
        when the topic&apos;s first interview goes up.
      </p>
    </div>
  );
}
