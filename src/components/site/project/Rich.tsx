// Plain text from a project's data file, with its quotes marked. A quote is written {{Who: words}} in the data and
// renders as <q data-by="Who">words</q>, so the quotes on a page can be counted and checked.
import { Fragment } from 'react';

const QUOTE = /\{\{([^:}]+):\s*([^}]+)\}\}/g;

export function Rich({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(QUOTE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <q key={at} data-by={m[1].trim()}>
        {m[2].trim()}
      </q>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}

export function Paras({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <>
      {items.map((t, i) => (
        <p key={i} className={className}>
          <Rich text={t} />
        </p>
      ))}
    </>
  );
}
