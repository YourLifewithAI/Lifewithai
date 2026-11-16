import Link from 'next/link';
import type { Piece } from '@/lib/pieces';
import { fill } from '@/lib/project';
import { stageLabel } from '@/lib/site';
import { slot, words } from '@/lib/words';
import { TopicIcon } from './TopicIcons';

// One card sheet: form, title, who, the receipt, and a title block (piece, topic, stage).
// The card's own labels are in words/topic-page.md; the piece's words in words/pieces/<id>.md.
export default function PieceCard({ piece, n, total }: { piece: Piece; n: number; total: number }) {
  const w = words('topic-page');
  return (
    <li className="sheet card">
      <div className="sheet-body">
        <div className="card-top">
          <p className="form">{piece.form}</p>
          <TopicIcon id={piece.topic} className="ic-s" />
        </div>
        <h3>
          <Link href={piece.href} className="card-link">
            {piece.title}
          </Link>
        </h3>
        <p className="meta">{piece.who}</p>
        <p>{piece.hook}</p>
        <ul className="chips" aria-label={slot(w, 'Card: main parts, for screen readers')}>
          {piece.receipt.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="tb">
        <div>
          <b>{slot(w, 'Card: piece')}</b>
          <span className="num">{fill(slot(w, 'Card: piece number'), { n, total })}</span>
        </div>
        <div>
          <b>{slot(w, 'Card: topic')}</b>
          <span>{piece.topicLabel}</span>
        </div>
        <div>
          <b>{slot(w, 'Card: stage')}</b>
          <span>{stageLabel(piece.stage)}</span>
        </div>
      </div>
    </li>
  );
}
