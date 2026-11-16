// The topic strip: six buildings and two open plots on one ground line, built as a title block. Each cell shows
// only its name (Ben, 2026-11-15: "The simple topic headers are sufficient").
// Every topic starts as a dashed drawing. Its first interview fills it in, with a flag.
// Its words are in words/home.md (the "Topics" and "Open plots" slots) and words/topics/.
import Link from 'next/link';
import { OPEN_PLOTS } from '@/lib/topics';
import { topics } from '@/lib/topic-words';
import { interviewsFor } from '@/lib/pieces';
import { list, slot, words } from '@/lib/words';
import { TopicIcon } from './TopicIcons';

export default function Strip({
  current,
  headingId = 'topics-h',
  intro,
}: {
  current?: string;
  headingId?: string;
  intro?: string;
}) {
  const w = words('home');
  const openNames = list(w, 'Open plots');
  return (
    <div className="topics">
      <div className="topics-head">
        <h2 id={headingId}>{slot(w, 'Topics heading')}</h2>
      </div>
      {intro ? <p className="topics-intro">{intro}</p> : null}
      <ul className="strip" aria-labelledby={headingId}>
        {topics().map((t) => {
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
                  <span className="verb">{t.verb}</span>
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
                <span className="verb">{openNames[i] ?? ''}</span>{' '}
                <span className="vh">{slot(w, 'Open plot, for screen readers')}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="strip-key">
        <span className="key-flag" aria-hidden="true" />
        {slot(w, 'Topics: the key under the drawings')}
      </p>
    </div>
  );
}
