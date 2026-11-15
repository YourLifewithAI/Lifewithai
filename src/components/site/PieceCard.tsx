import Link from 'next/link';
import type { Piece } from '@/lib/pieces';
import { stageLabel } from '@/lib/site';
import { topicById } from '@/lib/topics';
import { TopicIcon } from './TopicIcons';

// One card sheet: form, title, who, the receipt, and a title block (piece, topic, stage).
export default function PieceCard({ piece, n, total }: { piece: Piece; n: number; total: number }) {
  const topic = topicById(piece.topic);
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
        <ul className="chips" aria-label="Main parts">
          {piece.receipt.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="tb">
        <div>
          <b>Piece</b>
          <span className="num">
            {n} of {total}
          </span>
        </div>
        <div>
          <b>Topic</b>
          <span>{topic?.verb}</span>
        </div>
        <div>
          <b>Stage</b>
          <span>{stageLabel(piece.stage)}</span>
        </div>
      </div>
    </li>
  );
}
