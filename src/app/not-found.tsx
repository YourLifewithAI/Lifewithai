import { inline, slot, words } from '@/lib/words';

// Its words are in words/not-found.md.
export default function NotFound() {
  const w = words('not-found');
  return (
    <div className="sheet">
      <div className="sheet-body page-head stack">
        <h1>{slot(w, 'Title')}</h1>
        <p className="copy" dangerouslySetInnerHTML={{ __html: inline(slot(w, 'Text')) }} />
      </div>
    </div>
  );
}
