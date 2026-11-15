import type { Metadata } from 'next';
import Link from 'next/link';
import { stageLabel } from '@/lib/site';
import { PIECES } from '@/lib/pieces';
import { topicById } from '@/lib/topics';
import { pageMeta } from '@/lib/meta';

// A stub so links resolve. A later port fills the full build page.
const asher = PIECES.find((p) => p.id === 'asher')!;

export const metadata: Metadata = pageMeta({ title: 'Asher', description: asher.hook, path: '/projects/asher' });

export default function AsherPage() {
  const topic = topicById(asher.topic);
  return (
    <div className="sheet">
      <div className="sheet-body page-head">
        <p className="form">{asher.form}</p>
        <h1>{asher.title}</h1>
        <p className="lead">{asher.hook}</p>
        <p className="copy">The full build page is on its way.</p>
      </div>
      <div className="tb">
        <div>
          <b>Builder</b>
          <span>Ben</span>
        </div>
        <div>
          <b>Topic</b>
          <span>
            <Link href={`/topics/${asher.topic}`}>{topic?.verb}</Link>
          </span>
        </div>
        <div>
          <b>Stage</b>
          <span>{stageLabel(asher.stage)}</span>
        </div>
        <div>
          <b>Status</b>
          <span>Real, Ben&apos;s bench</span>
        </div>
      </div>
    </div>
  );
}
